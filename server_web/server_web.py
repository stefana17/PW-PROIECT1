import socket
import os # pentru dimensiunea fisierului
import gzip
import json

def update_utilizatori(new_data, filename='continut/resurse/utilizatori.json'):
    with open(filename, 'r+') as file:
        # Load existing data into a list.
        file_data = json.load(file)
        print('########################################## file_data')
        print(file_data)
        # Load new data into a list.
        new_data_list = json.loads(new_data)
        print('########################################## new_data_list')
        print(new_data_list)
        # Append new data to existing data list.
        file_data.append(new_data_list)
        # Sets file's current position at offset.
        file.seek(0)
        # Convert back to JSON and write to file.
        json.dump(file_data, file, indent=4)
	
# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

while True:
	print ('#########################################################################')
	print ('Serverul asculta potentiali clienti.')
	# asteapta conectarea unui client la server
	# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
	(clientsocket, address) = serversocket.accept()
	print ('S-a conectat un client.')
	# se proceseaza cererea si se citeste prima linie de text
	cerere = ''
	linieDeStart = ''
	while True:
		buf = clientsocket.recv(1024)
		if len(buf) < 1:
			break
		cerere = cerere + buf.decode()
		print ('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
		pozitie = cerere.find('\r\n')
		if (pozitie > -1 and linieDeStart == ''):
			linieDeStart = cerere[0:pozitie]
			print ('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
			break
	print ('S-a terminat cititrea.')
	if linieDeStart == '':
		clientsocket.close()
		print ('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
		continue
	# interpretarea sirului de caractere `linieDeStart`
	elementeLineDeStart = linieDeStart.split()
	# TODO securizare
	numeResursaCeruta = elementeLineDeStart[1]
	if numeResursaCeruta == '/':
		numeResursaCeruta = '/index.html'
	
	# calea este relativa la directorul de unde a fost executat scriptul
	numeFisier = 'continut/' + numeResursaCeruta
	
	fisier = None
	try:
		# deschide fisierul pentru citire in mod binar
		fisier = open(numeFisier,'rb')
		# tip media
		numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
		tipuriMedia = {
			'html': 'text/html; charset=utf-8',
			'css': 'text/css; charset=utf-',
			'js': 'text/javascript; charset=utf-8',
			'png': 'image/png',
			'jpg': 'image/jpeg',
			'jpeg': 'image/jpeg',
			'gif': 'image/gif',
			'ico': 'image/x-icon',
			'xml': 'application/xml; charset=utf-8',
			'json': 'application/json; charset=utf-8'
		}
		tipMedia = tipuriMedia.get(numeExtensie,'text/plain; charset=utf-8')
		
		# se trimite raspunsul
		clientsocket.sendall('HTTP/1.1 200 OK\r\n'.encode())
		clientsocket.sendall(f"Content-Length: {str(os.stat(numeFisier).st_size)} '\r\n".encode())
		clientsocket.sendall(f"Content-Type: {tipMedia} \r\n".encode())
		#gclientsocket.sendall(f"Content-Encoding: {gzip}\r\n".encode())
		clientsocket.sendall('Server: My PW Server\r\n'.encode())
		clientsocket.sendall('\r\n'.encode())
		
		# citeste din fisier si trimite la server
		buf = fisier.read(1024)
		while (buf):
			#buf_gzip = gzip.compress(buf)
			#clientsocket.send(buf_gzip)
			clientsocket.send(buf)
			buf = fisier.read(1024)
	except IOError:
		if numeResursaCeruta == '/api/utilizatori':
			if elementeLineDeStart[0] == "POST":
				print('-----Cerere')
				print(cerere)
				print(cerere)
				print('---------Array')
				array = cerere.split('{')
				print(array)
				myJson = "{" + array[1]
				print('-----------My Json')
				print(myJson)
				update_utilizatori(myJson)
		# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
		msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
		print (msg)
		clientsocket.sendall('HTTP/1.1 404 Not Found\r\n'.encode())
		clientsocket.sendall(f"Content-Length: {str(len(msg.encode('utf-8')))}\r\n".encode())
		clientsocket.sendall('Content-Type: text/plain; charset=utf-8\r\n'.encode())
		clientsocket.sendall('Server: My PW Server\r\n'.encode())
		clientsocket.sendall('\r\n'.encode())
		clientsocket.sendall(msg.encode())
 
	finally:
		if fisier is not None:
			fisier.close()
	clientsocket.close()
	print ('S-a terminat comunicarea cu clientul.')

