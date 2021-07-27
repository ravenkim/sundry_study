# Copyright 2021 Mischief Gadgets LLC

import glob
import os
import platform
import sys
import serial
from serial.tools.list_ports import comports
from serial.tools import hexlify_codec
from scripts import flashapi as flashapi
from time import time
from signal import signal, SIGINT
from sys import exit

from pprint import pprint


try:
    raw_input
except NameError:
    # pylint: disable=redefined-builtin,invalid-name
    raw_input = input   # in python3 it's "raw"
    unichr = chr


VERSION = "FIRMWARE FLASHER VERSION NUMBER [ 070421 @ 003304 EST ] .[d]."
FLASHER_VERSION = 2 # presume we have an old style flasher 
FLASHER_SKIP_ON_VALID_DETECTION = True
UPDATES = "FOR UPDATES VISIT: [ https://github.com/O-MG/O.MG_Cable-Firmware ]\n"

MOTD = """\
               ./ohds. -syhddddhys: .oddo/.
                `: oMM+ dMMMMMMMMm`/MMs :`
             `/hMh`:MMm .:-....-:- hMM+`hMh/
           `oNMm:`sMMN:`:+osssso+:`-NMMy.:dMNo`
          +NMMs +NMMh`:mMMMMMMMMMMN/`yMMNo +MMN+
        .dMMMy sMMMh oMNhs+////+shNMs yMMMy sMMMd.
       -NMMM+  NMMMd`-.  `.::::.`  .:`hMMMM` +MMMN-
      -NMMN-   hMMMMMdhhmMMMMMMMMmhhdNMMMMd   -NMMN.
      mMMM- `m:`hMMMMMMMMMmhyyhmMMMMMMMMMd.-d` -MMMm
     +MMMs  dMMs -sMMMMm+`      `+mMMMMs: oMMh  sMMM+
     dMMM` :MMMy  oMMMy            yMMMo  hMMM: `MMMd
     MMMm  sMMM:  NMMN              NMMN  :MMMs  mMMM
    `MMMd  yMMM- `MMMd              dMMM` :MMMs  dMMM`
     NMMN  +MMMo  dMMM:            :MMMN. +MMM+  NMMN
     yMMM/ `NMMN` .NMMN+          +MMMMMMh.+MN` /MMMy
     .MMMm` /MMMd` .hMMMNy+:--:+yNMMMdsNMMN.+/ `mMMM.
      +MMMh  +MMMN/  :hMMMMMMMMMMMMh:  yMMM/   hMMM+
       sMMMh` -mMMMd/` `:oshhhhy+:` `/dMMMh  `hMMMs
        oMMMN/  +mMMMMho:.      .:ohMMMMm/  :NMMMo
         -mMMMd:  :yNMMMMMMNNNNMMMMMMNy:  :dMMMm-
           +NMMMmo   -+shmNMMMMNmhs+-  .omMMMN+
            `/dNo.:/              `-+ymMMMMd/
                /mM-.:/+ossyyhhdmNMMMMMMdo.
              -mMMMMMMMMMMMMMMMMMMNdy+-
             /MMMMMMmyso+//::--.`
            :MMMMNNNNs-
           `Ndo:`    `.`
           :-\
"""

def handler(signal_received, frame):
    # Handle any cleanup here
    print('SIGINT or CTRL-C detected. Exiting gracefully')
    exit(0)

class omg_results():
    def __init__(self):
        self.OS_DETECTED = ""
        self.PROG_FOUND = False
        self.PORT_PATH = ""
        self.WIFI_DEFAULTS = False
        self.WIFI_SSID = "O.MG-Cable"
        self.WIFI_PASS = "12345678"
        self.WIFI_MODE = "1"
        self.WIFI_TYPE = "STATION"
        self.FILE_PAGE = "page.mpfs"
        self.FILE_INIT = "esp_init_data_default_v08.bin"
        self.FILE_ELF0 = "image.elf-0x00000.bin"
        self.FILE_ELF1 = "image.elf-0x10000.bin"
        self.FILE_ELF2 = "image.elf-0x20000.bin"

def get_dev_info(dev):
    esp = flashapi.ESP8266ROM(dev, baudrate, None)
    esp.connect(None)
    mac = esp.read_mac()

    esp.flash_spi_attach(0)
    flash_id = esp.flash_id()
    size_id = flash_id >> 16
    flash_size = {0x14: 0x100000, 0x15: 0x200000, 0x16: 0x400000}[size_id]
    return mac, flash_size

def ask_for_flasherhwver():
    """
        Ask for the flasher version, either 1 or 2 right now...
    """
    if FLASHER_SKIP_ON_VALID_DETECTION and FLASHER_VERSION != 1:
        return FLASHER_VERSION
        
    flash_version = FLASHER_VERSION
    if FLASHER_VERSION is None:
        while True:
            try:
                flash_version = int(raw_input("--- Enter version of programmer hardware [Available Versions: 1 or 2] (Detected is Version {FLASHVER}): ".format(FLASHVER=flash_version)))
            except:
                pass
            if flash_version == 1 or flash_version == 2:
                break
        print("<<< USER REPORTED HARDWARE FLASHER REVISION AS VERSION", flash_version, ">>>")
    return flash_version    
    
def ask_for_port():
    """\
    Show a list of ports and ask the user for a choice. To make selection
    easier on systems with long device names, also allow the input of an
    index.
    """
    i = 0
    sys.stderr.write('\n--- Available ports:\n')
    ports = []
    skippedports = []
    for n, (port, desc, hwid) in enumerate(sorted(comports()), 1):
        includedport = "CP2102"
        if includedport in desc:
            i+=1
            sys.stderr.write('--- {:2}: {:20} {!r}\n'.format(i, port, desc))
            ports.append(port)
        else: 
            skippedports.append(port)
    while True:
        num_ports = len(ports)
        if num_ports == 1:
            return ports[0]
        else:
            port = raw_input('--- Enter port index or full name: ')
            try:
                index = int(port) - 1
                if not 0 <= index < len(ports):
                    sys.stderr.write('--- Invalid index!\n')
                    continue
            except ValueError:
                pass
            else:
                port = ports[index]
            return port

def omg_flash(command,tries=2):
    global FLASHER_VERSION
    ver = FLASHER_VERSION
    from pprint import pprint
    pprint(ver)
    if int(ver) == 2:
        try:
            flashapi.main(command)
            return True
        except (flashapi.FatalError, serial.SerialException, serial.serialutil.SerialException) as e:
            print("Error", str(e))
            return False
    else:
        ret = False
        while tries>0:
            try:
                ret = flashapi.main(command)
                print("<<< PLEASE UNPLUG AND REPLUG CABLE BEFORE CONTINUING >>>")
                input("Press Enter to continue when ready...")
                ret = True
                break
            except (flashapi.FatalError, serial.SerialException, serial.serialutil.SerialException) as e:
                tries-=1
                print("Unsuccessful communication,", tries, "trie(s) remain")
        if not ret:
            print("<<< ERROR DURING FLASHING PROCESS PREVENTED SUCCESSFUL FLASH. TRY TO RECONNECT CABLE OR REBOOT >>>")
            complete(1)
        else:
            return ret

def complete(statuscode, message="Press Enter to continue..."):
    input(message)
    sys.exit(statuscode)


def omg_locate():
    PAGE_LOCATED = False
    INIT_LOCATED = False
    ELF0_LOCATED = False
    ELF1_LOCATED = False
    ELF2_LOCATED = False

    if os.path.isfile(results.FILE_PAGE):
        PAGE_LOCATED = True
    else:
        if os.path.isfile("firmware/" + results.FILE_PAGE):
            results.FILE_PAGE = "firmware/" + results.FILE_PAGE
            PAGE_LOCATED = True

    if os.path.isfile(results.FILE_INIT):
        INIT_LOCATED = True
    else:
        if os.path.isfile("firmware/" + results.FILE_INIT):
            results.FILE_INIT = "firmware/" + results.FILE_INIT
            INIT_LOCATED = True

    if os.path.isfile(results.FILE_ELF0):
        ELF0_LOCATED = True
    else:
        if os.path.isfile("firmware/" + results.FILE_ELF0):
            results.FILE_ELF0 = "firmware/" + results.FILE_ELF0
            ELF0_LOCATED = True

    if os.path.isfile(results.FILE_ELF1):
        ELF1_LOCATED = True
    else:
        if os.path.isfile("firmware/" + results.FILE_ELF1):
            results.FILE_ELF1 = "firmware/" + results.FILE_ELF1
            ELF1_LOCATED = True

    if os.path.isfile(results.FILE_ELF2):
        ELF2_LOCATED = True
    else:
        if os.path.isfile("firmware/" + results.FILE_ELF2):
            results.FILE_ELF2 = "firmware/" + results.FILE_ELF2
            ELF2_LOCATED = True


    if PAGE_LOCATED and INIT_LOCATED and ELF0_LOCATED and ELF1_LOCATED and ELF2_LOCATED:
        print("\n<<< ALL FIRMWARE FILES LOCATED >>>\n")
    else:
        print("<<< SOME FIRMWARE FILES ARE MISSING, PLACE THEM IN THIS FILE'S DIRECTORY >>>")
        if not PAGE_LOCATED: print("\n\tMISSING FILE: {PAGE}".format(PAGE=results.FILE_PAGE))
        if not INIT_LOCATED: print("\tMISSING FILE: {INIT}".format(INIT=results.FILE_INIT))
        if not ELF0_LOCATED: print("\tMISSING FILE: {ELF0}".format(ELF0=results.FILE_ELF0))
        if not ELF1_LOCATED: print("\tMISSING FILE: {ELF1}".format(ELF1=results.FILE_ELF1))
        if not ELF2_LOCATED: print("\tMISSING FILE: {ELF2}".format(ELF2=results.FILE_ELF2))
        print('')
        complete(1)


def omg_probe():
    devices = ""
    results.PROG_FOUND = False

    detected_ports = ask_for_port()
    devices = detected_ports
 
    FLASHER_VERSION = ask_for_flasherhwver()
    
    results.PROG_FOUND = True
    results.PORT_PATH = devices
    
    if results.PROG_FOUND:
        print("\n<<< O.MG-CABLE-PROGRAMMER WAS FOUND ON {PORT} >>>".format(PORT=results.PORT_PATH))
    else:
        if results.OS_DETECTED == "DARWIN":
            print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND IN DEVICES, YOU MAY NEED TO INSTALL THE DRIVERS FOR CP210X USB BRIDGE >>>\n")
            print("VISIT: [ https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers ]\n")
        else:
            print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND IN DEVICES >>>\n")
        complete(1)


def omg_patch(_ssid, _pass, _mode):
    FILE_PAGE = results.FILE_PAGE

    try:
        BYTES = []
        with open(FILE_PAGE, "rb") as f:
            byte = f.read(1)
            BYTES.append(byte)
            while byte != b"":
                byte = f.read(1)
                BYTES.append(byte)

            offset = 0

            for i, byte in enumerate(BYTES):
                if chr(int(hex(int.from_bytes(BYTES[i+0],"big"))[2:].upper(),16)) == 'a':
                    if chr(int(hex(int.from_bytes(BYTES[i+1],"big"))[2:].upper(),16)) == 'c':
                        if chr(int(hex(int.from_bytes(BYTES[i+2],"big"))[2:].upper(),16)) == 'c':
                            if chr(int(hex(int.from_bytes(BYTES[i+3],"big"))[2:].upper(),16)) == 'e':
                                if chr(int(hex(int.from_bytes(BYTES[i+4],"big"))[2:].upper(),16)) == 's':
                                    if chr(int(hex(int.from_bytes(BYTES[i+5],"big"))[2:].upper(),16)) == 's':
                                        if chr(int(hex(int.from_bytes(BYTES[i+6],"big"))[2:].upper(),16)) == '.':
                                            if chr(int(hex(int.from_bytes(BYTES[i+7],"big"))[2:].upper(),16)) == 'l':
                                                if chr(int(hex(int.from_bytes(BYTES[i+8],"big"))[2:].upper(),16)) == 'o':
                                                    if chr(int(hex(int.from_bytes(BYTES[i+9],"big"))[2:].upper(),16)) == 'g':
                                                        offset = i
                                                        break
        offset+=24
        d=hex(int.from_bytes(BYTES[offset+0],"big"))[2:].zfill(2)
        c=hex(int.from_bytes(BYTES[offset+1],"big"))[2:].zfill(2)
        b=hex(int.from_bytes(BYTES[offset+2],"big"))[2:].zfill(2)
        a=hex(int.from_bytes(BYTES[offset+3],"big"))[2:].zfill(2)
        offset=int(a+b+c+d,16)
        length=len("SSID {SSID} PASS {PASS} MODE {MODE}".format(SSID=_ssid,PASS=_pass,MODE=_mode))
        aligned=114
        _bytes=bytearray("SSID {SSID}\0PASS {PASS}\0MODE {MODE}{NULL}".format(SSID=_ssid,PASS=_pass,MODE=_mode,NULL="\0"*(aligned-length)).encode("utf8"))
        for i in range(offset+0,offset+aligned):
            BYTES[i]=_bytes[i-offset]
        pprint(BL)
        try:
            os.remove(FILE_PAGE)
        except:
            pass
        with open(FILE_PAGE, 'bw+') as f:
            for byte in BL:
                if type(byte) == int:
                    f.write(bytes([byte]))
                else:
                    f.write(byte)
        print("\n<<< PATCH SUCCESS, FLASHING FIRMWARE >>>\n")
    except KeyError:
        print("\n<<< PATCH FAILURE, ABORTING >>>")
        complete(1)


def omg_input():
    WIFI_MODE = ''
    SANITIZED_SELECTION = False

    while not SANITIZED_SELECTION:

        try:
            WIFI_MODE = input("\nSELECT WIFI MODE\n1: STATION - (Connect to existing network. 2.4GHz Channels 1-7)\n2: ACCESS POINT - (Create SSID. IP: 192.168.4.1)\n")
            if WIFI_MODE == '' or WIFI_MODE == '1' or WIFI_MODE == '2':
                SANITIZED_SELECTION = True
        except:
            pass

    if len(WIFI_MODE) == 1:
        results.WIFI_DEFAULTS = False
        results.WIFI_MODE = WIFI_MODE
        if WIFI_MODE == '1':
            results.WIFI_TYPE = 'STATION'
        else:
            results.WIFI_TYPE = 'ACCESS POINT'
    else:
        results.WIFI_DEFAULTS = True

    if not results.WIFI_DEFAULTS:

        WIFI_SSID = ''
        SANITIZED_SELECTION = False

        while not SANITIZED_SELECTION:
            try:
                WIFI_SSID = input("\nENTER WIFI SSID (1-32 Characters): ")
                if len(WIFI_SSID) > 1 and len(WIFI_SSID) < 33:
                    SANITIZED_SELECTION = True
            except:
                pass

        results.WIFI_SSID = WIFI_SSID

        WIFI_PASS = ''
        SANITIZED_SELECTION = False

        while not SANITIZED_SELECTION:
            try:
                WIFI_PASS = input("\nENTER WIFI PASS (8-64 Characters): ")
                if len(WIFI_PASS) > 7 and len(WIFI_PASS) < 65:
                    SANITIZED_SELECTION = True
            except:
                pass

        results.WIFI_PASS = WIFI_PASS


def omg_flashfw():
    mac, flash_size = get_dev_info(results.PORT_PATH)

    try:
        FILE_PAGE = results.FILE_PAGE
        FILE_INIT = results.FILE_INIT
        FILE_ELF0 = results.FILE_ELF0
        FILE_ELF1 = results.FILE_ELF1
        FILE_ELF2 = results.FILE_ELF2

        if flash_size < 0x200000:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'write_flash', '-fs', '1MB', '-fm', 'dout', '0xfc000', FILE_INIT, '0x00000', FILE_ELF0, '0x10000', FILE_ELF1, '0x80000', FILE_PAGE] #, '0x7f000', FILE_ELF2]
        else:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'write_flash', '-fs', '2MB', '-fm', 'dout', '0x1fc000', FILE_INIT, '0x00000', FILE_ELF0, '0x10000', FILE_ELF1, '0x80000', FILE_PAGE] #, '0x17f000', FILE_ELF2]
        omg_flash(command)

    except:
        print("\n<<< SOMETHING FAILED WHILE FLASHING >>>")
        complete(1)


def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))


if __name__ == '__main__':
    signal(SIGINT, handler)
    print("\n" + VERSION)
    print("\n" + UPDATES)
    print("\n" + MOTD + "\n")

    results = omg_results()
    baudrate = '115200'

    thedirectory = get_script_path()
    os.chdir(thedirectory)

    try:
        import serial
    except:
        print("\n<<< PYSERIAL MODULE MISSING, MANUALLY INSTALL TO CONTINUE >>>")
        print("<<< YOU CAN TRY: npm install serial or pip install pyserial >>>")
        complete(1)

    try:
        from scripts import flashapi as flashapi
    except:
        try:
            from scripts import flashapi as flashapi
        except:
            print("<<< flashapi.PY MISSING FROM scripts/flashapi.py >>>")
            print("<<< PLEASE RE-DOWNLOAD FROM https://github.com/O-MG/O.MG_Cable-Firmware >>>")
            complete(1)

    results.OS_DETECTED = platform.system().upper()

    omg_locate()

    omg_probe()

    MENU_MODE = ''
    SANITIZED_SELECTION = False

    while not SANITIZED_SELECTION:
        try:
            menu_options = [
                'FLASH NEW FIRMWARE',
                'FACTORY RESET',
                'FIRMWARE UPGRADE - BATCH MODE',
                'FACTORY RESET - BATCH MODE',
                'BACKUP CABLE',
                'EXIT FLASHER',
            ]
            print("Available Options \n")
            i = 1
            for menu_option in menu_options:
                 print(i," ",menu_option,end="")
                 if i == 1:
                     print(" (DEFAULT)")
                 else:
                     print("")
                 i+=1    
            menu_options = [''] 
            MENU_MODE = str(input("Select Option: ")).replace(" ","")
            if MENU_MODE == '1' or MENU_MODE == '2' or MENU_MODE == '3' or MENU_MODE == '4' or MENU_MODE == '5' or MENU_MODE == '6':
                SANITIZED_SELECTION = True
        except:
            pass
    # handle python serial exceptions here        
    try:
    
        if MENU_MODE == '1':
            print("\nFIRMWARE UPGRADE")
            #mac, flash_size = get_dev_info(results.PORT_PATH)
            #command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x7F0000', '0x1000']
            #omg_flash(command)

            omg_input()
            omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
            omg_flashfw()
            print("\n[ WIFI SETTINGS ]")
            print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
            print("\n[ FIRMWARE USED ]")
            print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
            print("\n<<< PROCESS FINISHED, REMOVE CABLE >>>\n")
        elif MENU_MODE == '2':
            print("\nFACTORY RESET")
            mac, flash_size = get_dev_info(results.PORT_PATH)
            if flash_size < 0x200000:
                command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x8A000']
            else:
                command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x18A000']
            omg_flash(command)

            omg_input()
            omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
            omg_flashfw()
            print("\n[ WIFI SETTINGS ]")
            print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
            print("\n[ FIRMWARE USED ]")
            print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
            print("\n<<< PROCESS FINISHED, REMOVE CABLE >>>\n")
        elif MENU_MODE == '3':
            baudrate = '460800'
            mac, flash_size = get_dev_info(results.PORT_PATH)
            print("\nFIRMWARE UPGRADE - BATCH MODE")
            omg_input()
            repeating = ''
            while repeating != 'e':
                #command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x7F0000', '0x1000']
                #omg_flash(command)
                omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
                omg_flashfw()
                print("\n[ WIFI SETTINGS ]")
                print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
                print("\n[ FIRMWARE USED ]")
                print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
                print("\n<<< PROCESS FINISHED, REMOVE CABLE AND PLUG IN NEW CABLE >>>\n")
                repeating = input("\n\n<<< PRESS ENTER TO UPGRADE NEXT CABLE, OR 'E' TO EXIT >>>\n")
                complete(0)
        elif MENU_MODE == '4':
            baudrate = '460800'
            mac, flash_size = get_dev_info(results.PORT_PATH)
            print("\nFACTORY RESET - BATCH MODE")
            omg_input()
            repeating = ''
            while repeating != 'e':
                if flash_size < 0x200000:
                    command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x8A000']
                else:
                    command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x18A000']
                omg_flash(command)
                omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
                omg_flashfw()
                print("\n[ WIFI SETTINGS ]")
                print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
                print("\n[ FIRMWARE USED ]")
                print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
                print("\n<<< PROCESS FINISHED, REMOVE CABLE >>>\n")
                repeating = input("\n\n<<< PRESS ENTER TO RESTORE NEXT CABLE, OR 'E' TO EXIT >>>\n")
        elif MENU_MODE == '5':
            print("\nBACKUP CABLE")
            mac, flash_size = get_dev_info(results.PORT_PATH)
            filename = "backup-{MACLOW}-{TIMESTAMP}.img".format(MACLOW="".join([hex(m).lstrip("0x") for m in mac]).lower(),TIMESTAMP=int(time()))
            if flash_size < 0x200000:
                command = ['--baud', baudrate, '--port', results.PORT_PATH, 'read_flash', '0x00000', '0x100000', filename]
            else:
                command = ['--baud', baudrate, '--port', results.PORT_PATH, 'read_flash', '0x00000', '0x200000', filename]
            omg_flash(command)
            print('Backup written to ', filename)
        elif MENU_MODE == '6':
            print("<<< GOOD BYE. FLASHER EXITING >>> ")
            sys.exit(0)
        else:
            print("<<< NO VALID INPUT WAS DETECTED. >>>")
    except (flashapi.FatalError, serial.SerialException, serial.serialutil.SerialException) as e:
        print("<<< PLEASE DISCONNECT AND RECONNECT CABLE AND START TASK AGAIN >>>")
        sys.exit(1) # special case
    complete(0)
