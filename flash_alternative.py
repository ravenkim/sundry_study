# Copyright 2020 Mischief Gadgets LLC

import os
import sys
import glob
import platform

VERSION="FIRMWARE FLASHER VERSION NUMBER [ 040120 @ 203515 CST ] .[d]."
UPDATES="FOR UPDATES VISIT: [ https://github.com/O-MG/O.MG_Cable-Firmware ]\n"

MOTD="""\
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

class omg_results():
    def __init__(self):
        self.OS_DETECTED = ""
        self.PORT_FOUND = False
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

def omg_locate():

    PAGE_LOCATED = False
    INIT_LOCATED = False
    ELF0_LOCATED = False
    ELF1_LOCATED = False

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

    if PAGE_LOCATED and INIT_LOCATED and ELF0_LOCATED and ELF1_LOCATED:
        print("\n<<< ALL FIRMWARE FILES LOCATED >>>\n")
    else:
        print("<<< SOME FIRMWARE FILES ARE MISSING, PLACE THEM IN THIS FILE'S DIRECTORY >>>")
        if not PAGE_LOCATED: print("\n\tMISSING FILE: {PAGE}".format(PAGE=results.FILE_PAGE))
        if not INIT_LOCATED: print("\tMISSING FILE: {INIT}".format(INIT=results.FILE_INIT))
        if not ELF0_LOCATED: print("\tMISSING FILE: {ELF0}".format(ELF0=results.FILE_ELF0))
        if not ELF1_LOCATED: print("\tMISSING FILE: {ELF1}".format(ELF1=results.FILE_ELF1))
        print('')
        sys.exit(1)

def omg_probe():

    devices = ""
    results.PORT_FOUND = False

    if results.OS_DETECTED == "WINDOWS":
        print("<<< PROBING WINDOWS COMPORTS FOR O.MG-CABLE-PROGRAMMER >>>\n")
        for i in range(1,257):
            try:
                comport = "COM{PORT}".format(PORT=i)
                command = [ '--baud', '115200', '--port', comport, '--no-stub', 'chip_id' ]
                esptool.main(command)
                results.PORT_FOUND = True
                results.PORT_PATH = comport
                break
            except:
                pass

        if results.PORT_FOUND:
            print("\n<<< O.MG-CABLE-PROGRAMMER WAS FOUND ON PORT} >>>".format(PORT=results.PORT_PATH))
        else:
            print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND ON THESE COMPORTS >>>\n")
            sys.exit(1)

    elif results.OS_DETECTED == "DARWIN":
        print("<<< PROBING OSX DEVICES FOR O.MG-CABLE-PROGRAMMER >>>\n")
        devices = glob.glob("/dev/cu.*SLAB*UART*")
        devices += glob.glob("/dev/cu.usbserial*")
    elif results.OS_DETECTED == "LINUX":
        print("<<< PROBING LINUX DEVICES FOR O.MG-CABLE-PROGRAMMER >>>\n")
        devices = glob.glob("/dev/ttyUSB*")

    if results.OS_DETECTED == "DARWIN" or results.OS_DETECTED == "LINUX":
        for i in range(len(devices)):
            try:
                devport = "{PORT}".format(PORT=devices[i])
                command = [ '--baud', '115200', '--port', devport, '--no-stub', 'chip_id' ]
                esptool.main(command)
                results.PORT_FOUND = True
                results.PORT_PATH = devices[i]
                break
            except:
                pass

        if results.PORT_FOUND:
            print("\n<<< O.MG-CABLE-PROGRAMMER WAS FOUND AT {PORT} >>>".format(PORT=results.PORT_PATH))
        else:
            if results.OS_DETECTED == "DARWIN":
                print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND IN DEVICES, YOU MAY NEED TO INSTALL THE DRIVERS FOR CP210X USB BRIDGE >>>\n")
                print("VISIT: [ https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers ]\n")
            else:
                print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND IN DEVICES >>>\n")
            sys.exit(1)

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
        try:
            os.remove(FILE_PAGE)
        except:
            pass
        with open(FILE_PAGE, 'bw+') as f:
            for byte in BYTES:
                if type(byte)==int:
                    f.write(bytes([byte]))
                else:
                    f.write(byte)
        print("\n<<< PATCH SUCCESS, FLASHING FIRMWARE >>>\n")
    except:
        print("\n<<< PATCH FAILURE, ABORTING >>>")
        sys.exit(1)

def omg_input():
    WIFI_MODE = ''
    SANITIZED_SELECTION = False

    while not SANITIZED_SELECTION:

        try:
            WIFI_MODE = input("\nSELECT WIFI MODE: 1) STATION or 2) ACCESS POINT or ENTER) DEFAULTS: ")
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
                WIFI_SSID = input("\nENTER WIFI SSID (limit 1-32chars): ")
                if len(WIFI_SSID) > 1 and len(WIFI_SSID) < 33:
                    SANITIZED_SELECTION = True
            except:
                pass

        results.WIFI_SSID = WIFI_SSID

        WIFI_PASS = ''
        SANITIZED_SELECTION = False

        while not SANITIZED_SELECTION:
            try:
                WIFI_PASS = input("\nENTER WIFI PASS (limit 8-64chars): ")
                if len(WIFI_PASS) > 7 and len(WIFI_PASS) < 65:
                    SANITIZED_SELECTION = True
            except:
                pass

        results.WIFI_PASS = WIFI_PASS

def omg_flash():

    try:
        FILE_PAGE = results.FILE_PAGE
        FILE_INIT = results.FILE_INIT
        FILE_ELF0 = results.FILE_ELF0
        FILE_ELF1 = results.FILE_ELF1

        command = ['--baud', '115200', '--port', results.PORT_PATH, 'write_flash', '-fs', '1MB', '-fm',
                   'dout', '0xfc000', FILE_INIT, '0x00000', FILE_ELF0, '0x10000', FILE_ELF1, '0x80000', FILE_PAGE]
        esptool.main(command)

    except:
        print("\n<<< SOMETHING FAILED WHILE FLASHING >>>")
        sys.exit(1)

def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))

if __name__=='__main__':
    print("\n" + VERSION)
    print("\n" + UPDATES)
    print("\n" + MOTD + "\n")

    results = omg_results()

    thedirectory=get_script_path()
    os.chdir(thedirectory)

    try:
        import serial
    except:
        print("\n<<< PYSERIAL MODULE MISSING, MANUALLY INSTALL TO CONTINUE >>>")
        sys.exit(1)

    try:
        import esptool
    except:
        try:
            from scripts import esptool as esptool
        except:
            print("<<< ESPTOOL.PY MISSING, PLACE IT IN THIS FILE'S DIRECTORY >>>")
            sys.exit(1)

    results.OS_DETECTED = platform.system().upper()

    omg_locate()

    omg_probe()

    omg_input()

    omg_patch( results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE )

    omg_flash()

    print("\n[ WIFI SETTINGS ]")
    print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))

    print("\n[ FIRMWARE USED ]")
    print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))

    print("\n<<< PROCESS FINISHED, REMOVE PROGRAMMER >>>\n")
    sys.exit(0)
