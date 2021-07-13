# Copyright 2021 Mischief Gadgets LLC

import glob
import os
import platform
import sys
import serial
from serial.tools.list_ports import comports
from serial.tools import hexlify_codec
from scripts import flashapi as flashapi

try:
    raw_input
except NameError:
    # pylint: disable=redefined-builtin,invalid-name
    raw_input = input   # in python3 it's "raw"
    unichr = chr


VERSION = "FIRMWARE FLASHER VERSION NUMBER [ 070421 @ 003304 EST ] .[d]."
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

def get_dev_info(dev):
    esp = flashapi.ESP8266ROM(dev, baudrate, None)
    esp.connect(None)
    mac = esp.read_mac()

    esp.flash_spi_attach(0)
    flash_id = esp.flash_id()
    size_id = flash_id >> 16
    flash_size = {0x14: 0x100000, 0x15: 0x200000, 0x16: 0x400000}[size_id]
    return mac, flash_size

def ask_for_port():
    """\
    Show a list of ports and ask the user for a choice. To make selection
    easier on systems with long device names, also allow the input of an
    index.
    """
    sys.stderr.write('\n--- Available ports:\n')
    ports = []
    for n, (port, desc, hwid) in enumerate(sorted(comports()), 1):
        includedport = "CP2102"
        if includedport in desc:
            excludedport = "usbserial"
            if excludedport in port:
                print("Excluded a device")
            else:
                sys.stderr.write('--- {:2}: {:20} {!r}\n'.format(n, port, desc))
                ports.append(port)
        else: 
            print("Excluded a device")
    while True:
        count = len(ports)
        print(count)
        if count == 1:
            return port
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

def complete(statuscode, message="Press Enter to continue..."):
    input(message)
    sys.exit(statuscode)


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
        complete(1)


def omg_probe():
    devices = ""
    results.PROG_FOUND = False

    if results.OS_DETECTED == "WINDOWS":
        detected_ports = ask_for_port()
        devices = detected_ports
        print("<<< PROBING COMPORTS FOR O.MG-CABLE-PROGRAMMER >>>\n")
        for i in range(1, 1):
            try:
                comport = devices
                command = ['--baud', baudrate, '--port', comport, '--no-stub', 'chip_id']
                flashapi.main(command)
                results.PROG_FOUND = True
                results.PORT_PATH = comport
                break
            except:
                pass

        if results.PROG_FOUND:
            print("\n<<< O.MG-CABLE-PROGRAMMER WAS FOUND ON {PORT} >>>".format(PORT=results.PORT_PATH))
        else:
                print("<<< O.MG-CABLE-PROGRAMMER WAS NOT FOUND ON THESE COMPORTS >>>\n")
                complete(1)

    elif results.OS_DETECTED == "DARWIN":
        detected_ports = ask_for_port();
        devices = detected_ports;
        print("<<< PROBING FOR O.MG-CABLE-PROGRAMMER >>>\n")
    elif results.OS_DETECTED == "LINUX":
        detected_ports = ask_for_port();
        devices = detected_ports;
        print("<<< PROBING FOR O.MG-CABLE-PROGRAMMER >>>\n")

    if results.OS_DETECTED == "DARWIN" or results.OS_DETECTED == "LINUX":
        devport = devices
        command = ['--baud', baudrate, '--port', devport, '--no-stub', 'chip_id']
        flashapi.main(command)
        results.PROG_FOUND = True
        results.PORT_PATH = devices

        if results.PROG_FOUND:
            print("\n<<< O.MG-CABLE-PROGRAMMER WAS FOUND AT %s >>>" % (str(results.PORT_PATH)))
        else:
            port = ''
            if port != '':
                devport = devices
                command = ['--baud', baudrate, '--port', devport, '--no-stub', 'chip_id']
                flashapi.main(command)
                results.PROG_FOUND = True
                results.PORT_PATH = devices[i]
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
                if chr(int(hex(int.from_bytes(BYTES[i + 0], "big"))[2:].upper(), 16)) == 'a':
                    if chr(int(hex(int.from_bytes(BYTES[i + 1], "big"))[2:].upper(), 16)) == 'c':
                        if chr(int(hex(int.from_bytes(BYTES[i + 2], "big"))[2:].upper(), 16)) == 'c':
                            if chr(int(hex(int.from_bytes(BYTES[i + 3], "big"))[2:].upper(), 16)) == 'e':
                                if chr(int(hex(int.from_bytes(BYTES[i + 4], "big"))[2:].upper(), 16)) == 's':
                                    if chr(int(hex(int.from_bytes(BYTES[i + 5], "big"))[2:].upper(), 16)) == 's':
                                        if chr(int(hex(int.from_bytes(BYTES[i + 6], "big"))[2:].upper(), 16)) == '.':
                                            if chr(int(hex(int.from_bytes(BYTES[i + 7], "big"))[2:].upper(), 16)) == 'l':
                                                if chr(int(hex(int.from_bytes(BYTES[i + 8], "big"))[2:].upper(), 16)) == 'o':
                                                    if chr(int(hex(int.from_bytes(BYTES[i + 9], "big"))[2:].upper(), 16)) == 'g':
                                                        offset = i
                                                        break
        offset += 24
        d = hex(int.from_bytes(BYTES[offset + 0], "big"))[2:].zfill(2)
        c = hex(int.from_bytes(BYTES[offset + 1], "big"))[2:].zfill(2)
        b = hex(int.from_bytes(BYTES[offset + 2], "big"))[2:].zfill(2)
        a = hex(int.from_bytes(BYTES[offset + 3], "big"))[2:].zfill(2)
        offset = int(a + b + c + d, 16)
        length = len("SSID {SSID} PASS {PASS} MODE {MODE}".format(SSID=_ssid, PASS=_pass, MODE=_mode))
        aligned = 114
        _bytes = bytearray("SSID {SSID}\0PASS {PASS}\0MODE {MODE}{NULL}".format(SSID=_ssid, PASS=_pass, MODE=_mode, NULL="\0" * (aligned - length)).encode("utf8"))
        for i in range(offset + 0, offset + aligned):
            BYTES[i] = _bytes[i - offset]
        try:
            os.remove(FILE_PAGE)
        except:
            pass
        with open(FILE_PAGE, 'bw+') as f:
            for byte in BYTES:
                if type(byte) == int:
                    f.write(bytes([byte]))
                else:
                    f.write(byte)
        print("\n<<< PATCH SUCCESS, FLASHING FIRMWARE >>>\n")
    except:
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


def omg_flash():
    mac, flash_size = get_dev_info(results.PORT_PATH)

    try:
        FILE_PAGE = results.FILE_PAGE
        FILE_INIT = results.FILE_INIT
        FILE_ELF0 = results.FILE_ELF0
        FILE_ELF1 = results.FILE_ELF1

        if flash_size < 0x200000:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'write_flash', '-fs', '1MB', '-fm', 'dout', '0xfc000', FILE_INIT, '0x00000', FILE_ELF0, '0x10000', FILE_ELF1, '0x80000', FILE_PAGE]
        else:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'write_flash', '-fs', '2MB', '-fm', 'dout', '0x1fc000', FILE_INIT, '0x00000', FILE_ELF0, '0x10000', FILE_ELF1, '0x80000', FILE_PAGE]
        flashapi.main(command)

    except:
        print("\n<<< SOMETHING FAILED WHILE FLASHING >>>")
        complete(1)


def get_script_path():
    return os.path.dirname(os.path.realpath(sys.argv[0]))


if __name__ == '__main__':
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
        print("<<< YOU CAN TRY: npm install serial OR pip install pyserial >>>")
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
            MENU_MODE = input("\nSELECT FUNCTION:\n1: FLASH NEW FIRMWARE (DEFAULT)\n2: FACTORY RESET\n3: FIRMWARE UPGRADE - BATCH MODE\n4: FACTORY RESET - BATCH MODE\n5: BACKUP CABLE\n")
            if MENU_MODE == '1' or MENU_MODE == '2' or MENU_MODE == '3' or MENU_MODE == '4' or MENU_MODE == '5':
                SANITIZED_SELECTION = True
        except:
            pass

    if MENU_MODE == '1':
        print("\nFIRMWARE UPGRADE")
        mac, flash_size = get_dev_info(results.PORT_PATH)
        command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x7F0000', '0x1000']
        flashapi.main(command)

        omg_input()
        omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
        omg_flash()
        print("\n[ WIFI SETTINGS ]")
        print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
        print("\n[ FIRMWARE USED ]")
        print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
        print("\n<<< PROCESS FINISHED, REMOVE PROGRAMMER >>>\n")
    elif MENU_MODE == '2':
        print("\nFACTORY RESET")
        mac, flash_size = get_dev_info(results.PORT_PATH)
        if flash_size < 0x200000:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x8A000']
        else:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x70000', '0x18A000']
        flashapi.main(command)

        omg_input()
        omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
        omg_flash()
        print("\n[ WIFI SETTINGS ]")
        print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
        print("\n[ FIRMWARE USED ]")
        print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
        print("\n<<< PROCESS FINISHED, REMOVE PROGRAMMER >>>\n")
    elif MENU_MODE == '3':
        baudrate = '460800'
        mac, flash_size = get_dev_info(results.PORT_PATH)
        print("\nFIRMWARE UPGRADE - BATCH MODE")
        omg_input()
        repeating = ''
        while repeating != 'e':
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'erase_region', '0x7F0000', '0x1000']
            flashapi.main(command)
            omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
            omg_flash()
            print("\n[ WIFI SETTINGS ]")
            print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
            print("\n[ FIRMWARE USED ]")
            print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
            print("\n<<< PROCESS FINISHED, REMOVE PROGRAMMER >>>\n")
            repeating = input("\n\n<<< PRESS ENTER TO UPGRADE NEXT CABLE, OR 'E' TO EXIT >>>\n")
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
            flashapi.main(command)
            omg_patch(results.WIFI_SSID, results.WIFI_PASS, results.WIFI_MODE)
            omg_flash()
            print("\n[ WIFI SETTINGS ]")
            print("\n\tWIFI_SSID: {SSID}\n\tWIFI_PASS: {PASS}\n\tWIFI_MODE: {MODE}\n\tWIFI_TYPE: {TYPE}".format(SSID=results.WIFI_SSID, PASS=results.WIFI_PASS, MODE=results.WIFI_MODE, TYPE=results.WIFI_TYPE))
            print("\n[ FIRMWARE USED ]")
            print("\n\tINIT: {INIT}\n\tELF0: {ELF0}\n\tELF1: {ELF1}\n\tPAGE: {PAGE}".format(INIT=results.FILE_INIT, ELF0=results.FILE_ELF0, ELF1=results.FILE_ELF1, PAGE=results.FILE_PAGE))
            print("\n<<< PROCESS FINISHED, REMOVE PROGRAMMER >>>\n")
            repeating = input("\n\n<<< PRESS ENTER TO RESTORE NEXT CABLE, OR 'E' TO EXIT >>>\n")
    elif MENU_MODE == '5':
        print("\nBACKUP CABLE")
        mac, flash_size = get_dev_info(results.PORT_PATH)
        if flash_size < 0x200000:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'read_flash', '0x00000', '0x100000', 'backup.img']
        else:
            command = ['--baud', baudrate, '--port', results.PORT_PATH, 'read_flash', '0x00000', '0x200000', 'backup.img']
        flashapi.main(command)
        print('Backup written to backup.img')

    else:
        print("<<< NO VALID INPUT WAS DETECTED. >>>")

    complete(0)
