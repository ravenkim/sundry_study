#!/usr/bin/env python3

#  omgtool.py v1.2
#  
#  Copyright 2020 Mischief Gadgets LLC
#  
#  Developed by @spiceywasabi 2020
#  
#  Ol;..';dKMMMMMMMMMMMMMMMMMMMMMMNkc,..,cx
#  MWX0d,..,xNMMMMMMMMMMMMMMMMMMWO:..'lOKNM
#  MMMMMK:...lNMMMMMMMMMMMMMMMMMk...'kWMMMM
#  MMMMMWl...;0MMMMMMMMMMMMMMMMNc...:KMMMMM
#  MMMMXo....cXMMMMMMMMMMMMMMMMWd....c0WMMM
#  MMNk;....:0MMMMMMMMMMMMMMMMMMXo....'dXMM
#  WO:....'dXMMMMMMMMMMMMMMMMMMMMWO;....,xN
#  k'....,kWMMMMMMMMMMMMMMMMMMMMMMMKc.....o
#  ;.....oWMMMMMMMMMMMMMMMMMMMMMMMMMO'.....
#  '.....;0WMMMMWX0OkxxxxkO0XWMMMMMXl......
#  ,.......:oool:,..........';coooc,.......
#  o......................................:
#  Nx'...................................lK
#  MWKd:.........,ok0KKKK0ko;.........;o0WM
#  MMMMO,......;kNMMMMMMMMMMNO:.......xMMMM
#  MMMNl......cXMMMMMMMMMMMMMMNl......;KMMM
#  MMMO,.....;KMMMMMMMMMMMMMMMMX:......xMMM
#  MMMk......lWMMMMMMMMMMMMMMMMMo......dMMM
#  MMMO,.....,0MMMMMMMMMMMMMMMMK;......dMMM
#  MMMNc......:KMMMMMMMMMMMMMMXc......;0MMM
#  MMMMO,......,dXMMMMMMMMMMNx;.......xWMMM
#  MMMMMO,.......'cdkOOOOOdl,.......'xWMMMM
#  MMMMMMKl........................:0WMMMMM
#  MMMMMMMW0l'...................cONMMMMMMM
#  MMMMMMMMMWXkl;'..........';lxKWMMMMMMMMM
#  MMMMMMMMMMMMMN0xolcccclox0NMMMMMMMMMMMMM
#  
#  ------ BEGIN NOTES ------ 
#  Basic install guide: You need an O.MG Cable, Python 3, and websocket_client
#  which is available via pip. Limited support available. Patches welcome! 
#  ------ END NOTES ------ 
#

import sys,os
import argparse
import threading
import shlex
import logging
from time import sleep
from math import floor,ceil
from websocket import create_connection
from websocket._exceptions import *
from pprint import pprint # leave this for debugging, not used during prod. 

VERBOSITY=0 # global variable, rip

class Duckpiler():
	output = ""
	mapping = {
		'space': 44,
		'enter': 40,
		'tab': 43,
		'capslock': 57,
		'del': 76,
		'delete': 76,
		'end': 77,
		'home': 74,
		'insert': 73,
		'numlock': 83,
		'pageup': 75,
		'pagedown': 78,
		'scrolllock': 71,
		'pause': 72,
		'esc': 41,
		'escape': 41,
		'right': 79,
		# missing USB SER
		'left': 80,
		'down': 81,
		'up': 82,
		'a': 4,
		'b': 5,
		'c': 6,
		'd': 7,
		'e': 8,
		'f': 9,
		'g': 10,
		'h': 11,
		'i': 12,
		'j': 13,
		'k': 14,
		'l': 15,
		'm': 16,
		'n': 17,
		'o': 18,
		'p': 19,
		'q': 20,
		'r': 21,
		's': 22,
		't': 23,
		'u': 24,
		'v': 25,
		'w': 26,
		'x': 27,
		'y': 28,
		'z': 29,
		'f1': 58,
		'f2': 59,
		'f3': 60,
		'f4': 61,
		'f5': 62,
		'f6': 63,
		'f7': 64,
		'f8': 65,
		'f9': 66,
		'f10': 67,
		'f11': 68,
		'f12': 69
	}

	
	# this allows us to build method "modules" to easily add commands and features
	def commands(self):
		commands = {
				"STRING":self.cmd_string,
				"SELF-DESTRUCT":self.cmd_selfdestruct,
				"DELAY":self.cmd_delay,
				"NEUTER":self.cmd_neuter,
				"CONTROL":self.cmd_ctrl,
				"WAIT_FOR_PRESENT":self.cmd_waitforpresent,
				"WAIT_FOR_PRESENT":self.cmd_waitfornotpresent,
				"IF_PRESENT":self.cmd_ifpresent,
				"IF_PRESENT":self.cmd_ifnotpresent,
				"PRO":self.cmd_pro,
				"MAN":self.cmd_man,
				"VID":self.cmd_vid,
				"PID":self.cmd_pid,
				"CTRL":self.cmd_ctrl,
				"SHIFT":self.cmd_shift,
				"ALT":self.cmd_alt,
				"GUI":self.cmd_gui,
				"WINDOWS":self.cmd_gui,
				"ESC":self.cmd_esc,
				"ESCAPE":self.cmd_esc,
				"RIGHT":self.cmd_right,
				"RIGHTARROW":self.cmd_right,
				"LEFT":self.cmd_left,
				"LEFTARROW":self.cmd_left,
				"DOWN":self.cmd_down,
				"DOWNARROW":self.cmd_down,
				"UP":self.cmd_up,
				"UPARROW":self.cmd_up,
				"PAGEUP":self.processKey,
				"PAGEDOWN":self.processKey,
				"ENTER":self.processKey,
				"TAB":self.processKey,
				"SPACE":self.processKey,
				"CAPSLOCK":self.processKey,
				"DELETE":self.processKey,
				"END":self.processKey,
				"HOME":self.processKey,
				"INSERT":self.processKey,
				"NUMLOCK":self.processKey,
				"SCROLLLOCK":self.processKey,
				"PAUSE":self.processKey,
				"BREAK":self.processKey,
				"A":self.processKey,
				"B":self.processKey,
				"C":self.processKey,
				"D":self.processKey,
				"E":self.processKey,
				"F":self.processKey,
				"G":self.processKey,
				"H":self.processKey,
				"I":self.processKey,
				"J":self.processKey,
				"K":self.processKey,
				"L":self.processKey,
				"M":self.processKey,
				"N":self.processKey,
				"O":self.processKey,
				"P":self.processKey,
				"Q":self.processKey,
				"R":self.processKey,
				"S":self.processKey,
				"T":self.processKey,
				"U":self.processKey,
				"V":self.processKey,
				"W":self.processKey,
				"X":self.processKey,
				"Y":self.processKey,
				"Z":self.processKey,
				"F1":self.processKey,
				"F2":self.processKey,
				"F3":self.processKey,
				"F4":self.processKey,
				"F5":self.processKey,
				"F6":self.processKey,
				"F7":self.processKey,
				"F8":self.processKey,
				"F9":self.processKey,
				"F10":self.processKey,
				"F11":self.processKey,
				"F12":self.processKey			
		}
		return commands

	def getOutput(self):
		return self.output
	
	def parseLine(self,ln):
			res = {}
			res['raw']=ln
			params = {}
			# using shlex provides a stronger processing support then by simply splitting. such as quotes.
			fields = shlex.split(ln)
			command = str(fields.pop(0))
			parse_pos = 0
			for field in fields:
				# if "=" in field:
				# 	# we	might have a param
				# 	param = str(field).replace("'","").replace("\"","").split("=")
				# 	# give us a chance to clean up
				# 	param_key = str(param[0]).strip()
				# 	param_val = str(param[1]).strip()
				# 	params[param_key]=param_val
				# 	del(fields[parse_pos])
				parse_pos+=1
			# remaining fields get added
			res['fields'] = fields
			res['params'] = params
			res['command'] = command
			return res

	def ceHex(self,nums):
		if len(nums)<3:
			return "00"
		b1 = self.numToHex(nums['b1'])
		b2 = self.numToHex(nums['b2'])
		b3 = self.numToHex(nums['b3'])
		
		c = b1+b2+b3
		
		print("%s,%s,%s = %s!!!! "%(b1,b2,b3,c))
		return c

	def ceBuildPayload(self,ceBuffer):
		cePayload = ''
		lo = "…………abcdefghijklmnopqrstuvwxyz1234567890………… -=[]\\…;'`,./"
		hi = '…………ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()……………_+{}|…:"~<>?'
		mod = 0
		key = 0
	
		for i in range(0,len(ceBuffer)):
			for x in range(0,len(lo)):
				hexPayload = {}
				if ceBuffer[i] == lo[x]:
					mod = 0 
					key = x
					hexPayload = {
						'b1':1,
						'b2':mod,
						'b3':key
					}
					cePayload+=self.ceHex(hexPayload)
			for y in range(0,len(hi)):
				hexPayload = {}
				if ceBuffer[i] == hi[y]:
					mod = 2
					key = y
					hexPayload = {
						'b1':1,
						'b2':mod,
						'b3':key
					}
					print(y)
					cePayload+=self.ceHex(hexPayload)
		return cePayload
			
	def keymap(self,char):
		lo = "…………abcdefghijklmnopqrstuvwxyz1234567890………… -=[]\\\;'`,./"
		hi = '…………ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()……………_+{}||:"~<>?'
		mod = 0
		key = 0
		for i, c in enumerate(lo):
			if char == c:
				key = i
				mod = 0
		for i, c in enumerate(hi):
			if char == c:
				key = i
				mod = 2
		return mod, key
    
	def ceBuildPayloadMap(self,ceBuffer):
		cePayload = ''
		for c in ceBuffer:
			k,m=self.keymap(c)
			print("|",end=" ")
			print(self.charToHex(c),end=" ")
			print(c,end=" ")
			print(k,end=" ")
			print(m,end=' |\n')
			cePayload+="01"+self.numToHex(m)+self.numToHex(k)		
		return cePayload
		
	def isHex(self,hstr):
		try:
			int(hstr,16)
			return True
		except:
			return False
		
	def toHex(self,rchr):	
		try:
			s=str(format(rchr,"X"))
			if len(s)==1:
				s="0"+s
			print("attempting to process %s to %s"%(str(rchr),s))
			return s
		except KeyError:
			return None
			
	def numToHex(self,rchr):
		try:
			return self.toHex(int(rchr))
		except KeyError: 
			return None
	
	def charToHex(self,rchr):
		try:
			return self.toHex(ord(rchr))
		except:
			return None
	
	def processLine(self,ln):
		parsed_line = self.parseLine(ln)
		upper_command = parsed_line['command']
		if "REM" in upper_command:
			logging.info("processLine - REM/Comment detecfted and skipping...")
			pass
		elif upper_command in self.commands():
			logging.info("processLine - Found handler for command '%s', passing to handler..." % upper_command)
			c =(self.commands())[upper_command](parsed_line)
			self.output+=c
			return c
		else:
			logging.warning("processLine - Error found command '%s' with no matching handler!" % upper_command)
		return None
	
	def readFile(self,fn):
		self.cePayload = '' # reset our payload if we're reading a file 
		output = []
		if os.path.exists(fn):
			with open(fn) as sf:
				logging.info("readFile - Begging processing of file %s " % fn)
				script_contents = sf.readlines()
				for script_line in script_contents.split("\n"):
					output.append(self.processLine(script_line))
			return output
		else:
			logging.error("readFile - Error file %s does not exist!" % fn)

	def encodeArg(self,prefix,cmdarg):
		output = ""
		i = 0
		while i<floor(len(cmdarg)/2):
			output+= prefix + self.charToHex(cmdarg[i*2]) + self.charToHex(cmdarg[(i*2)+1])
			i+=1
		if (len(cmdarg)%2) > 0:
			output += prefix + self.charToHex(cmdarg[-1]) + "00"
		return (output+";")
			
	def cmd_waitforpresent(self,processed_line):
		# processed line should contain all fields we need to begin checking
		waitForSSID = None
		waitForBSSID = None
		waitForMinutes = None
		waitForInterval = None
		
		# do set values
		if "SSID" in processed_line['fields']:
			waitForSSID = processed_line['fields']['SSID']
			if len(waitForSSID) > 32 or len(waitForSSID)<=0:
				logging.error("SSID is invalid (length error)")
				return False
		elif "BSSID" in processed_line['fields']:
			waitForBSSID = str(processed_line['fields']['BSSID']).upper()
			if len(waitForBSSID) == 17:
				logging.error("BSSID is the wrong length AA:BB:CC:DD:EE:FF")
		elif "MINUTES" in processed_line['fields']:
			waitForMinutes = processed_line['fields']['MINUTES']
		elif "INTERVAL" in processed_line['fields']:
			waitForMinutes = processed_line['fields']['INTERVAL']
		
		# do checks - ssid
		if waitForBSSID is not None and waitForSSID is not None:
			logging.error("cmd_waitforpresent - Error SSID and BSSID both set, one or the other only must be set")
			return False
		elif (waitForMinutes is not None or waitForInterval is not None) and (waitForSSID is None and waitForBSSID is None):
			logging.error("cmd_waitforpresent - Error wait for minutes or interval is set but no SSID/BSSID is set!")
			return False
		
		# do checks
		if waitForSSID:
			prefix="28"
			processArg=waitForSSID
		elif waitForBSSID:
			prefix="29"
			processArg=waitForBSSID
		else:
			logging.error("cmd_waitforpresent - ERROR INVALID PREFIX")
		# more checks
		minutes = "00"
		if waitForMinutes:
			if int(waitForMinutes)>60 or int(waitForMinutes)<0:
				logging.error("cmd_waitforpresent - Error minutes cannot be greater then 60 or less then 0")
				return False
			minutes = self.numToHex(waitForMinutes)
		
		interval = "03"
		if waitForInterval:
			if int(waitForInterval)>255 or int(waitForInterval)<0:
				logging.error("cmd_waitforpresent - Error interval must be greater then 0 and less then 255")
				return False
			interval = self.numToHex(waitForInterval)
		
		# run stuff
		output = prefix + "0106"
		
		output+=self.encodeArg(prefix,processArg)
		
		output += prefix + "02" + minutes; # MINUTES
		output += prefix + "03" + interval; # INTERVAL
		output += prefix + "0407"; # END

		return (output+";")
	
	def cmd_waitfornotpresent(self,processed_line):
		# processed line should contain all fields we need to begin checking
		waitForSSID = None
		waitForBSSID = None
		waitForMinutes = None
		waitForInterval = None
		
		# do set values
		if "SSID" in processed_line['fields']:
			waitForSSID = processed_line['fields']['SSID']
			if len(waitForSSID) > 32 or len(waitForSSID)<=0:
				logging.error("SSID is invalid (length error)")
				return False
		elif "BSSID" in processed_line['fields']:
			waitForBSSID = str(processed_line['fields']['BSSID']).upper()
			if len(waitForBSSID) == 17:
				logging.error("BSSID is the wrong length AA:BB:CC:DD:EE:FF")
		elif "MINUTES" in processed_line['fields']:
			waitForMinutes = processed_line['fields']['MINUTES']
		elif "INTERVAL" in processed_line['fields']:
			waitForMinutes = processed_line['fields']['INTERVAL']
		
		# do checks - ssid
		if waitForBSSID is not None and waitForSSID is not None:
			logging.error("cmd_waitfornotpresent - Error SSID and BSSID both set, one or the other only must be set")
			return False
		elif (waitForMinutes is not None or waitForInterval is not None) and (waitForSSID is None and waitForBSSID is None):
			logging.error("cmd_waitfornotpresent - Error wait for minutes or interval is set but no SSID/BSSID is set!")
			return False
		
		payloadVal = ""
		# do checks
		if waitForSSID:
			prefix="2A"
			payloadVal = waitForSSID
		elif waitForBSSID:
			prefix="2B"
			payloadVal = waitForBSSID
		else:
			logging.error("cmd_waitfornotpresent - ERROR INVALID PREFIX")
			
		# more checks
		minutes = "00"
		if waitForMinutes:
			if int(waitForMinutes)>60 or int(waitForMinutes)<0:
				logging.error("cmd_waitfornotpresent - Error minutes cannot be greater then 60 or less then 0")
				return False
			minutes = self.numToHex(waitForMinutes)
		
		interval = "03"
		if waitForInterval:
			if int(waitForInterval)>255 or int(waitForInterval)<0:
				logging.error("cmd_waitfornotpresent - Error interval must be greater then 0 and less then 255")
				return False
			interval = self.numToHex(waitForInterval)
		
		# run stuff
		output = prefix + "0106"

		output+=self.encodeArg(prefix,payloadVal)

		output += prefix + "02" + minutes; # MINUTES
		output += prefix + "03" + interval; # INTERVAL
		output += prefix + "0407"; # END

		return (output+";")
	
	def cmd_ifpresent(self,processed_line):
		presentSSID = None
		presentBSSID = None
		presentSignal = None

		# do set values
		if "SSID" in processed_line['fields']:
			waitForSSID = processed_line['fields']['SSID']
			if len(waitForSSID) > 32 or len(waitForSSID)<=0:
				logging.error("SSID is invalid (length error)")
				return False
		elif "BSSID" in processed_line['fields']:
			waitForBSSID = str(processed_line['fields']['BSSID']).upper()
			if len(waitForBSSID) == 17:
				logging.error("BSSID is the wrong length AA:BB:CC:DD:EE:FF")	
		elif "SIGNAL" in processed_line['fields']:
			# by removing - (as the javascript does) we remove the signal dB units which can be both positive or negative
			# we follow the javascript but this may change later. 
			presentSignal = str(processed_line['fields']['SIGNAL']).replace("-","")
		
		# now validate
		if presentSSID is not None and presentBSSID is not None:
			logging.error("cmd_ifpresent - Error SSID and BSSID both set, one or the other only must be set")
			return False

		# do checks
		if presentSSID:
			prefix="24"
			payloadVal = presentSSID
		elif presentBSSID:
			prefix="25"
			payloadVal = presentBSSID
		else:
			logging.error("cmd_ifpresent - ERROR INVALID PREFIX")
		
		
		# add everything together
		output = prefix + "0106"
		i = 0
		output+=self.encodeArg(prefix,payloadVal)

		if presentSignal:
			output += prefix + "02" + self.numToHex(presentSignal)
		output+=prefix+"0307" # ending 
		
		return (output+";")
	
	def cmd_ifnotpresent(self,processed_line):
		presentSSID = None
		presentBSSID = None
		presentSignal = None

		# do set values
		if "SSID" in processed_line['fields']:
			waitForSSID = processed_line['fields']['SSID']
			if len(waitForSSID) > 32 or len(waitForSSID)<=0:
				logging.error("SSID is invalid (length error)")
				return False
		elif "BSSID" in processed_line['fields']:
			waitForBSSID = str(processed_line['fields']['BSSID']).upper()
			if len(waitForBSSID) == 17:
				logging.error("BSSID is the wrong length AA:BB:CC:DD:EE:FF")	
		elif "SIGNAL" in processed_line['fields']:
			# by removing - (as the javascript does) we remove the signal dB units which can be both positive or negative
			# we follow the javascript but this may change later. 
			presentSignal = str(processed_line['fields']['SIGNAL']).replace("-","")
	
		# now validate
		if presentSSID is not None and presentBSSID is not None:
			logging.error("cmd_ifnotpresent - Error SSID and BSSID both set, one or the other only must be set")
			return False

		# do checks
		if presentSSID:
			prefix="26"
			payloadVal = presentSSID
		elif presentBSSID:
			prefix="27"
			payloadVal = presentBSSID
		else:
			logging.error("cmd_ifnotpresent - ERROR INVALID PREFIX")
		
		# add everything together
		output = prefix + "0106"
		i = 0
		output+=self.encodeArg(prefix,payloadVal)

		if presentSignal:
			output += prefix + "02" + self.numToHex(presentSignal)
		output+=prefix+"0307" # ending 
		
		return (output+";")

	def cmd_vid(self,processed_line):
		prefix = "0E"
		output = ""
		if len(processed_line['fields'])>=1:
			field = processed_line['fields'][0]
			if self.isHex(field):
				output+=prefix+field 
			return (output+";")
		return None

	def cmd_pid(self,processed_line):
		prefix = "0F"
		output = ""
		if len(processed_line['fields'])>=1:
			field = processed_line['fields'][0]
			if self.isHex(field):
				output+=prefix+field 
			return (output+";")
		return None
	
	def cmd_man(self,processed_line):
		prefix = "15"
		output = prefix + "0106"
		if len(processed_line['fields'])>=1:
			field = processed_line['fields'][0]
			i = 0
			output+=self.encodeArg(prefix,field)
			output+=prefix+"0207"
			return (output+";")
		return None

	def cmd_pro(self,processed_line):
		prefix = "16"
		output = prefix + "0106"
		if len(processed_line['fields'])>=1:
			field = processed_line['fields'][0]
			i = 0
			output+=self.encodeArg(prefix,field)
			output+=prefix+"0207"
		return None

	def cmd_ser(self,processed_line):
		prefix = "17"
		output = prefix + "0106"
		if len(processed_line['fields'])>=1:
			field = processed_line['fields'][0]
			i = 0
			output+=self.encodeArg(prefix,field)
			output+=prefix+"0207"
		return None
	
	def cmd_usb(self,processed_line):
		output = ""
		if len(processed_line['fields'])>=1:
			usb_state = str(processed_line['fields'][0]).upper()
			if usb_state=="ON" or usb_state=='1':
				output+="100001"
			elif usb_state=="OFF" or usb_state=='0':
				output+="100000"
		return (output+";")

	def cmd_jiggler(self,processed_line):
		output = ""
		if len(processed_line['fields'])>=1:
			usb_state = str(processed_line['fields'][0]).upper()
			if usb_state=="ON" or usb_state=='1':
				output+="110001"
			elif usb_state=="OFF" or usb_state=='0':
				output+="110000"
		return (output+";")
	
	def cmd_mouse(self,processed_line):
		output = ""
		if len(processed_line['params'])<2:
			logging.error("Invalid params for MOUSE")
			return (output+";")
		if str(processed_line['params'][0]).upper() == "CLICK":
			output += "0500" + self.numToHex(processed_line['params'][1])
		elif str(processed_line['params'][0]).upper() == "MOVE":
			x = int(processed_line['params'][1])
			y = int(processed_line['params'][2])
			abs_x = abs(x)
			abs_y = abs(y)
			# i don't understand this logic fully yet
			if (x<0) and (y<0):
				if abs_x>255:
					while(abs_x>255):
						output+="04" + self.numToHex(99) + self.numToHex(0)
						abs_x-=256
				output+="04" + self.numToHex(x) + self.numToHex(0)
				if abs_y>255:
					while abs_y>255:
						output+="04" + self.numToHex(0) + self.numToHex(255)
						abs_y-=256
				output+="04" + self.numToHex(0) + self.numToHex(y)
			elif (x<0) and (y>=0):
				if abs_x>255:
					while(abs_x>255):
						output+="04" + self.numToHex(255) + self.numToHex(0)
						abs_x-=256
				output+="04" + self.numToHex(x) + self.numToHex(0)
				if abs_y>255:
					while abs_y>255:
						output+="03" + self.numToHex(0) + self.numToHex(255)
						abs_y-=256
				output+="03" + self.numToHex(0) +	self.numToHex(y)	+ ""
			elif (x>=0) and (y<0):
				if abs_x>255:
					while(abs_x>255):
						output+="03" + self.numToHex(255) + self.numToHex(0)
						abs_x-=256
				output+="03" + self.numToHex(x) + self.numToHex(0)
				if abs_y>255:
					while abs_y>255:
						output+="04" + self.numToHex(0) + self.numToHex(255)
						abs_y-=256
				output+="04" + self.numToHex(0) + self.numToHex(y)
			elif (x<0) and (y>=0):
				if abs_x>255:
					while(abs_x>255):
						output+="03" + self.numToHex(255) + self.numToHex(0)
						abs_x-=256
				output+="03" + self.numToHex(x) + self.numToHex(0)
				if abs_y>255:
					while abs_y>255:
						output+="03" + self.numToHex(0) + self.numToHex(255)
						abs_y-=256
				output+="03" + self.numToHex(0) + self.numToHex(y)
		else:
			logging.error("MOUSE did not find valid command")
		return (output+";")

	def processKey(self,processed_line,lookup_value=None):
		if lookup_value is None:
			lookup_value = str(processed_line['command']).lower()
		else:
			lookup_value = str(lookup_value).lower() # why not?
		output=""
		if lookup_value in self.mapping:
			output += "0100" + self.numToHex(self.mapping[lookup_value])
		return (output+";")

	def processModifier(self,processed_line,iModify=1):
		output=""
		modValues = {
			'ctrl':1,
			'control':1,
			'shift':2,
			'alt':4,
			'gui':8,
			'windows':8
		}
		if len(processed_line['fields']) >= 1:
			lookup_value = str(processed_line['fields'][0]).lower()			
			# TODO #
			# Future improvements could be made here by creating a loop for each value where you increase n for each character in a processed line.
			if lookup_value in modValues:
				iModify+=modValues[lookup_value]
				print("0IMOD:%d"%iModify)
			if len(processed_line['fields'])>=2:
				lookup_value = str(processed_line['fields'][1]).lower()
				if lookup_value in modValues:
					iModify+=modValues[lookup_value]
				print("2IMOD:%d"%iModify)
			if len(processed_line['fields'])>=3:
				lookup_value = str(processed_line['fields'][2]).lower()
				if lookup_value in modValues:
					iModify+=modValues[lookup_value]	
				print("3IMOD:%d"%iModify)				
			if len(processed_line['fields'])>=4:
				lookup_value = str(processed_line['fields'][3]).lower()
				if lookup_value in modValues:
					iModify+=modValues[lookup_value]
				print("4IMOD:%d"%iModify)

		output+="01" + self.numToHex(iModify)
		lookup_value = None 

		if len(processed_line['fields'])==1:
			lookup_value = str(processed_line['fields'][0]).lower()
		elif len(processed_line['fields'])==2:
			lookup_value = str(processed_line['fields'][1]).lower()
		elif len(processed_line['fields'])==3:
			lookup_value = str(processed_line['fields'][2]).lower()
		elif len(processed_line['fields'])==4:
			lookup_value = str(processed_line['fields'][3]).lower()
		else:
			logging.warning("No match found on Key Modifier")

		if lookup_value is not None:
			mapped_value = self.mapping[lookup_value]
			output+=self.numToHex(mapped_value)				
		else:
			output+="00"
		return (output+";")
	
	def cmd_ctrl(self,processed_line):
		return self.processModifier(processed_line,1)
		
	def cmd_shift(self,processed_line):
		return self.processModifier(processed_line,2)
		
	def cmd_alt(self,processed_line):
		return self.processModifier(processed_line,4)
		
	def cmd_gui(self,processed_line):
		return self.processModifier(processed_line,8)
		
	def cmd_esc(self,processed_line):
		return processKey(processed_line,41)
		
	def cmd_pause(self,processed_line):
		return processKey(processed_line,72)
		
	def cmd_right(self,processed_line):
		return processKey(processed_line,79)
		
	def cmd_left(self,processed_line):
		return processKey(processed_line,80)
		
	def cmd_up(self,processed_line):
		return processKey(processed_line,82)
		
	def cmd_down(self,processed_line):
		return processKey(processed_line,81)
	
	def cmd_delay(self,processed_line):
		output=""
		prefix="02"
		bDelay=False
		if len(processed_line['fields'])<1:
			logging.error("cmd_delay - too few arguments to delay")
			return None	
		iDelay=int(processed_line['fields'][0])
		if iDelay>255:
			while iDelay>255:
				if not bDelay:
					output+=prefix + "01FF"
					bDelay=True
				else:
					output+=prefix + "02FF"
				iDelay-=256
			if not bDelay:
				output+=prefix + "0100"
			output += prefix + "03" + self.numToHex(iDelay)
		return (output+";")
	
	def cmd_neuter(self,processed_line):
		output="140000"
		return (output+";")
	
	def cmd_string(self,processed_line):
		f = " ".join(processed_line['fields'])
		p = self.ceBuildPayload(f)
		print("converting %s to %s"%(str(f),str(p)))
		output = p
		return (output+";")
		
	def cmd_selfdestruct(self,processed_line):
		output="130000"
		return (output+";")
			
class OMGInterface():
	def __init__(self,url):
		self.soc = None
		self.url = None
		
		if self.soc is None and url is not None:
			self.url = url
			self.connectSocket(self.url)

	def isHex(self,hstr):
		try:
			int(hstr,16)
			return True
		except:
			return False
		
	def toHex(self,rchr):	
		try:
			s=str(format(rchr,"x"))
			if len(s)==1:
				s="0"+s
			print("attempting to process %s to %s"%(str(rchr),s))
			return s
		except KeyError:
			return None
			
	def numToHex(self,rchr):
		try:
			return self.toHex(int(rchr))
		except KeyError: 
			return None
	
	def charToHex(self,rchr):
		try:
			return self.toHex(ord(rchr))
		except:
			return None
			
	def connectSocket(self,url):
		print("Connecting to URL: %s"%url)
		tries = 3
		success = False
		while (tries>0 and not success):
			try:
				self.soc = create_connection(url)
				success = True
			except (WebSocketConnectionClosedException,ConnectionResetError):
				print("Fatal: Unable to connect to websocket! %d tries remain." % (tries-1))
				success = False
				tries-=1
		if not success:
			sys.exit(1)
		else:
			print("Successfully connected to socket!")
		return self.soc
	
	def send(self,p):
		if self.soc is not None:
			s=self.soc
			print("Sending:")
			print(p)
			return s.send(p)
		else:
			return None

	def recv(self):
		if self.soc is not None:
			return self.soc.recv()
		else:
			return None 

	# cmd: loadslot1-7
	def loadPayload(self,slot):
		slot = int(slot)
		bufPayloadIndex = 0
		bufPayload = []
		o=b''
		user_addresses = [720896, 737280, 753664, 770048, 786432, 802816, 819200]
		if slot > len(user_addresses):
			logging.error("loadPayload -> slot wrong index")
		buff_len = 1024
		for i in range(0,16):
			user_addr = user_addresses[slot] + (i*1024)
			print("addr:%d+%d=%d"%(user_addresses[slot],(i*1024),user_addr))
			cmd = "FR" + str(user_addr) + "\t" + str(buff_len)
			self.send(cmd)
			r = (self.recv()).split(b"\t")
			cmd,size,output=r
			o+=output
		return o
		
	# cmd: checkboot
	def checkBoot(self):
		user_addr = 851968 # (0x7C000 + 0x3000) + 0x800;
		buff_len = 4
		cmd = "FR" + str(user_addr) + "\t" + str(buff_len)
		self.send(cmd)
		r = self.recv()
		cmd,mem,s = r.split(b'\t')
		return bool(s[0]==0x01)
	
	# cmd: toggleboot
	def toggleBoot(self,s=True):
		s = bool(s)
		# todo: enable or disable boot state
		cmd="FX851968\t4\t01000000"
		self.send(cmd)
		sleep(1)
		bstate = False
		try:
			bstate = self.checkBoot()
		except:
			pass	
		return bstate

	# cmd: wifiscan	
	def loadScan(self):
		self.send("CS0\t")
		r=self.recv()
		sleep(4)
		output=b''
		user_addresses = [520192, 521216, 522240, 523264]
		bufScanResultsIndex = 0
		bufScanResults = []
		ap_types = {
			"0": "AUTH_OPEN",
			"1": "AUTH_WEP",
			"2": "AUTH_WPA_PSK",
			"3": "AUTH_WPA2_PSK",
			"4": "AUTH_WPA_WPA2_PSK"
		}
		for i in range(0,4):
			user_addr = user_addresses[i]
			buff_len = 1024
			cmd = "FR" + str(user_addr) + "\t" + str(buff_len)
			self.send(cmd)
			c,s,r = (self.recv()).split(b"\t")
			output+=r
		valid_data = output.split(b'\x00')[0]
		networks = []
		for ssid in valid_data.split(b'\r\n'):
			comps = ssid.split(b'+')
			if len(ssid)<20:
				continue
			network = {
				'ssid':str(comps[1],'utf-8').upper(),
				'rssi':float(str(comps[2],'utf-8')),
				'bssid':str(comps[3],'utf-8'),
				'channel':int(str(comps[4],'utf-8'))
			}
			ap_type = str(comps[0],'utf-8')
			if ap_type in ap_types:
				network['ap_type']=ap_types[ap_type]
			
			networks.append(network)
		return networks	

	# cmd: getwifi
	def getWifi(self):
		self.send("WI")
		r = self.recv().split(b'\t')
		network = {
			'ssid':str(r[1],'utf-8'),
			'password':str(r[2],'utf-8'),
			'mac':str(r[3],'utf-8'),
			'channel':int(str(r[4],'utf-8'))
		}
		return network

	# cmd: setwifi (sub parse args --mode= --ssid= --password --channel --mac)
	def changeWifi(self,mode,ssid,password,channel,mac):
		st="W"
		st+=str(mode) # 1 = station, 2 = client
		st+="\t"+str(ssid)
		st+="\t"+str(password)
		st+="\t"+str(mac)
		st+="\t"+str(channel)
		self.send(st)
		#sleep(0.1)
		return True # do we even have a way to check?

	# cmd: reboot
	def sendReboot(self):
		self.send("CR1\t")
	
	# cmd: rekt
	def sendRekt(self):
		self.send("CD1\t")
	
	# cmd: notrekt
	def sendNotRekt(self):
		self.send("CD1\t")
		
	# cmd: enable*jiggler, disable*jiggler
	def sendJigglerToggle(self,s=True):
		jiggler_state = bool(s)
		# this can probably be accomplished by int(jiggler_state)
		cmd_line = "CJ"+str(int(jiggler_state))+"\t"
		self.send(cmd_line)

	# cmd: enable*usb, disable*usb
	def sendUSBToggler(self,s=True):
		usb_state = bool(s)
		if not usb_state:
			self.sendJigglerToggle(0)
		# this can probably be accomplished by int(jiggler_state)
		cmd_line = "CU"+str(int(usb_state))+"\t"
		self.send(cmd_line)

	
	def erasePayload(self,slot):
		user_addresses = [720896, 737280, 753664, 770048, 786432, 802816, 819200]
		operations = [176, 180, 184, 188, 192, 196, 200, 204]
		for i in range(0,4):
			cmd = "FE" + str(operations[int(slot)]+i)
			self.send(cmd)
	
	def writeScript(self,slot,script):
		user_addresses = [720896, 737280, 753664, 770048, 786432, 802816, 819200]
		segments = ceil(len(script)/512)
		if segments == 0:
			segments = 1
		self.erasePayload(slot)
		for i in range(0,segments):
			starto = i*512
			endo = starto+512
			parsement=script[starto:endo]
			alignment = ceil(len(parsement)/4)*4 # math, not even once
			user_addr = user_addresses[int(slot)]+starto
			cmd = "FW" + str(user_addr) + "\t" + str(alignment) + "\t" + parsement
			self.send(cmd)
	
	def splitProcess(self,payload):
		split_payloads = []
		if float(len(payload)/936) > 1.0:
			ops = ceil(len(payload)/936)
			for i in range(0,ops):
				distance = 936
				starto = i*distance
				endo = starto+distance
				parsement=payload[starto:endo]
				# do the thing
				this_sof = "20" + self.numToHex(i+1) +  self.numToHex(ops)
				this_eof = "30" +  self.numToHex(i+1) + self.numToHex(ops)
				split_payloads.append(this_sof + parsement + this_eof)
		else:
				ops = ceil(len(payload)/936)
				this_sof = "20" + self.numToHex(1) +  self.numToHex(ops)
				this_eof = "30" + self.numToHex(1) + self.numToHex(ops)
				split_payloads.append(this_sof + payload + this_eof);
		print(split_payloads)
		return split_payloads
	
	def encodePayload(self,commands):
		compiler = Duckpiler()
		output=""
		i=1
		for command in commands:
				print("command",end=" ")
				print(command)
				o=compiler.processLine(command)
				if o is None:
					print("Error! Command invalid on line %d"%i)
				i+=1
				output+=o
		return output.replace(";","")
	
	def runPayload(self,raw_script):
		if isinstance(raw_script,str):
			raw_script = raw_script.split("\n")
		payload = self.encodePayload(raw_script)
		split_payloads = self.splitProcess(payload)
		for split_payload in split_payloads:
			cmd = "ce" + split_payload + "\n"
			self.send(cmd)
		return True

	def saveBootPayload(self,raw_script):
		if isinstance(raw_script,str):
			raw_script = raw_script.split("\n")
		payload = self.encodePayload(raw_script)
		split_payloads = splitProcess(payload)
		buff = "".join(self.split_payloads)
		iterations = ceil(len(buff/512))
		if interations == 0:
			iterations = 1
		for i in range(0,iterations):
			starto = i*512
			endo = starto+512
			parsement = buff[starto:endo]
			alignment = ceil(len(parsement)/4)*4
			user_addr = 835584 + (i*512)
			cmd = "FW" + str(user_addr) + "\t" + str(alignment) + "\t" + parsement
			self.send(cmd)	
		self.send("FX851968\t4\t01000000")
		sleep(1)
		return True
      	


## WRITER TO SOCKET 
class OMGWriter(threading.Thread):
    def __init__(self, ipaddr, slot,input_script,pretty_slot=None):
        super(OMGWriter, self).__init__()
        self.ip_addr = ipaddr
        url = "ws://%s/d/ws/issue"%self.ip_addr
        self.omgsock = OMGInterface(url)
        self.slot = slot
        self.ogscript = input_script
        self.script = self.fix_script(input_script)
        self.pretty_slot = str(int(slot)+1)
        if pretty_slot:
        	self.pretty_slot = pretty_slot
        self.keepRunning = True
        
    def fix_script(self,input_script):
    	# just try to clean up stuff we don't want
    	new_output = []
    	temp_input_script = []
    	if "\n" in input_script and isinstance(input_script,str):
    		temp_input_script=input_script.split("\n")
    	else:
    		temp_input_script=input_script
    	# now redo
    	for l in temp_input_script:
    		new_output.append(l.replace("\\n","").replace("\r",""))
    	return new_output
    	
    def upload(self):
    	if self.slot == 8: # we are boot payload
    		return self.omgsock.saveBootPayload(self.script)
    	else:
    		return self.omgsock.writeScript(self.slot,"".join(self.script))
    
    def run(self):
    	i = 0
    	print("The thread for %s and slot %s is starting.."%(str(self.ip_addr),pretty_slot))
    	while self.keepRunning:
    		print("In thread for %s and slot %s, %d."%(str(self.ip_addr),pretty_slot,i))
    		i+=1
    		# do our work
    		self.upload()
    		self.keepRunning = False
    		# and wait
    		sleep(2)
    		i+1
    	print("The thread for %s and slot %s is now complete... Ending."%(str(self.ip_addr),pretty_slot))


def arg_help(p,msg):
	print(msg)
	p.print_help()
	sys.exit(1)

parser = argparse.ArgumentParser()

parser.add_argument('--inscript', '-a', type=argparse.FileType('r'),required=False)
# bin is unsupported at this time
#parser.add_argument('--inbin', '-b', type=argparse.FileType('r'),required=False)
parser.add_argument('--slot','-s',action='append', nargs='?',help="Specify which slot we will write to",required=False)
parser.add_argument('--command','-c',help="Command mode, issue a command to the cable",required=False)
parser.add_argument('--ip','-i', action='append', nargs='?',help="One or more IP Addresses to write scripts",required=False)
parser.add_argument("-v", "--verbosity", action="count",help="increase output verbosity")
# output is unsupported at this time but might work
parser.add_argument('--outfile','-o',type=argparse.FileType('w+'),help="Accepts destination file for script",required=False)
parser.add_argument('--wifi-ssid',help="SSID for setting SSID mode",required=False)
parser.add_argument('--wifi-password',help="WiFi Password",required=False)
parser.add_argument('--wifi-channel',help="WiFi Channel",required=False)
parser.add_argument('--wifi-mac',help="Allowed WiFI MAC",required=False)
parser.add_argument('--wifi-mode',help="WiFi Mode (station/client or ap)",required=False)

args = parser.parse_args()

#parser.print_help()

 
#if args.command is None and (args.inscript is not None): # and args.inbin is not None):
#	arg_help(parser,"!! Either a duck script or a binary (compiled) script may be used! NOT BOTH")

if args.command is None and args.ip is None and args.outfile is None:
	arg_help(parser,"!! Error! A destination mode must be selected")
	
if args.command is None and args.ip is not None and args.slot is None:
	arg_help(parser,"!! Error! Cable mode selected and slot must be defined")

# now we begin....
if args.outfile is not None:
	print("! FILE DEST MODE ...")
	# we don't care about much here so we call the handler and write 
	f = args.outfile
	try:
		f.write("# O.MG BIN SCRIPT 1.0\n")
		f.write(str(bfree).replace(" ",""))
		f.close()
	except:
		print("!! Error, unable to write to destination file...")
		sys.exit(1)
elif args.command is not None:
	cmd = str(args.command).strip()
	if args.ip is None:
		logging.error("One or more IP addresses must be defined!")
		sys.exit(1)
	if len(args.ip)>1:
		logging.error("Command mode only supports 1 IP at current time.")
		sys.exit(1)
	print("! COMMAND MODE .... Connecting to %s"%str(args.ip[0]))
	o = OMGInterface("ws://%s/d/ws/issues"%str(args.ip[0]))
	# cmd: checkboot
	if "checkboot" in cmd:
		if o.checkBoot():
			print("O.MG Cable Boot Slot: ENABLED")
		else:
			print("O.MG Cable Boot Slot: DISABLED")
		sys.exit(0)
	# cmd: toggleboot
	elif "enableboot" in cmd:
		bootstate = o.toggleBoot(True)
		print("O.MG Cable Boot Payload: enabled")
	# cmd: toggleboot
	elif "disableboot" in cmd:
		bootstate = o.toggleBoot(False)
		print("O.MG Cable Boot Payload: disabled")
	#cmd: readslot
	elif "readslot" in cmd or "loadpayload" in cmd:
		if args.slot is not None:
			slot = int(args.slot[0])-1		
			print("Loading Slot %s"%args.slot[0])
			ls = o.loadPayload(slot)
			if ls[0] != 0xff:			
				print("Slot Hex:")
				script = ls.split(b'\xff')[0].split(b'\x00')[0]
				print("".join("0x{:02x} ".format(x) for x in script))
				print("Slot String:")
				print(str(script))
			else:
				print("Slot is empty!")
	#cmd: runslot
	elif "runslot" in cmd or "loadslot" in cmd:
		if args.slot is not None:
			slot = int(args.slot[0])-1		
			print("Loading Slot %s"%args.slot[0])
			ls = o.loadPayload(slot)
			if ls[0] != 0xff:			
				script = ls.split(b'\xff')[0].split(b'\x00')[0]
				o.runPayload(script.decode("utf-8"))
	elif "loadboot" in cmd:
		print("Loading Boot Slot:")
		slot = o.loadPayload(6)
		print(slot)
	elif "wifiscan" in cmd or "scanwifi" in cmd:
		print("Cable is scanning for wifi...")
		wlanscan = o.loadScan() # cmd: wifiscan
		print("Got Networks:")
		for network in wlanscan:
			for name,value in network.items():
				print("\t%s:"%name,end="\t")
				print(value,end="\n")
			print("\n")
		print("\n\n")
	elif "getwifi" in cmd:
		print("Current Wifi Settings:")
		network = o.getWifi()
		for name,value in network.items():
			print("\t%s"%name,end=": ")
			print(value,end="\n")
	elif "reboot" in cmd:
		print("Cable rebooting.",end="")
		o.sendReboot()
		for i in range(1,20):
			print(".",end="")
			sleep(0.5)
		print("\n")
	elif "rekt" in cmd:
		print("Cable is rekt..")
		o.sendRekt()
	elif "notrekt" in cmd:
		print("Cable is remarkably less rekt..")
		o.sendNotRekt()
	elif "enableusb" in cmd:
		print("Enabling USB...")
		o.sendUSBToggler(True)
	elif "disableusb" in cmd:
		print("Disable USB...")
		o.sendUSBToggler(False)
	elif "enablejiggler" in cmd:
		print("Enabling jiggler...")
		o.sendJigglerToggle(True)
	elif "disablejiggler" in cmd:
		print("Disabling jiggler...")
		o.sendJigglerToggle(True)
	elif "changewifi" in cmd:
		if args.wifi_ssid is not None and wifi_password is not None and args.wifi_mode is not None:
			ssid = str(args.wifi_ssid)
			password = str(args.wifi_password)
			mode = str(args.wifi_mode)
			if mode == "ap" or "accesspoint":
				mode="2"
			else:
				mode="1"
			channel = "11"
			if args.wifi_channel is not None:
				channel = str(args.wifi_mode)
			mac = ""
			if args.wifi_mac is not None:
				mac = str(args.wifi_mac)
			# now do a check 
			if mode == '1':
				print("Updating WiFI Settings to be Station on %s"%ssid)
				o.changeWifi(mode,ssid,password,channel,mac)
			else:
				print("Updating WiFI Settings to be AP with SSID %s"%ssid)
				o.changeWifi(mode,ssid,password,channel,mac)
		else:
			print("Error! WiFi arguments are needed to update WiFi settings")
			print("Minimum: You must have options: --wifi-mode, --wifi-ssid, and --wifi-password")
			arg_help()
	else:
		print("Unknown command %s"%str(cmd))

		
elif args.slot is not None and args.ip is not None and len(args.ip)>=1:
	print("! CABLE DEST MODE ...")
	print("Preparing to flash O.MG Cables: ",end=" ")
	print(",  ".join(args.ip))
	print("Destination Slot(s):",end=" ")
	print(",  ".join(args.slot))
	print("Beginning...")
	input_script = args.inscript.readlines()
	args.inscript.close() # maybe? 
	for slot in args.slot:
		# adjust back to the way we need in the code. 
		pretty_slot = int(slot)
		if int(slot)>0:
			slot=pretty_slot-1
		print("Starting up encoding thread for slot %d...."%int(pretty_slot))
		for ip in args.ip:
			t = OMGWriter(ip,slot,input_script,pretty_slot)
			t.start()
else:
	print("!! Error! Something went wrong...")