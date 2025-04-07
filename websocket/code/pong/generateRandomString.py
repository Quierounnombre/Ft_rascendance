import random
import string

def generateRandomString(len) -> str:
	characters = string.ascii_letters + string.digits
	random_string = ''.join(random.choices(characters, k=len))  
	return random_string