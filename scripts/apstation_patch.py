import os
import sys
MOTD=""" \
                                              
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
       :-




\
"""

if __name__=='__main__':

        print(MOTD)

        try:
                _ssid=sys.argv[1]
                _pass=sys.argv[2]
                _mode=sys.argv[3]
        except:
                print("\n[ missing parameters, usage: 'python3 {} ssid pass mode' ]\n".format(sys.argv[0]))
                sys.exit(1)

        if(len(_ssid)>32):
                print("\n[ ssid too long, length limit is 32 characters ]\n")
                sys.exit(1)
        if(len(_pass)>64):
                print("\n[ pass too long, length limit is 64 characters ]\n")
                sys.exit(1)
        if(len(_pass)<8):
                print("\n[ pass too short, 8-64 characters required ]\n")
                sys.exit(1)
        if(len(_mode)>1):
                print("\n[ mode wrong, length limit is 1 character ]\n")
                sys.exit(1)

        FLAG=0

        try:
                if int(_mode)<1 or int(_mode)>2:
                        print("\n[ mode wrong, mode is 1 for station or 2 for access point ]\n")
                        FLAG=1
        except:
                        print("\n[ mode wrong, mode is 1 for station or 2 for access point ]\n")
                        FLAG=1
        if FLAG:
                sys.exit(5)

        try:
                BYTES = []
                with open("firmware/page.mpfs", "rb") as f:
                        byte = f.read(1)
                        BYTES.append(byte)
                        while byte != b"":
                                byte = f.read(1)
                                BYTES.append(byte)

                offset = 0

                for i, byte in enumerate(BYTES):
                        if chr(int(hex(int.from_bytes(byte,"big"))[2:].upper(),16)) == 'a':
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
                        os.remove("firmware/page.mpfs")
                except:
                        pass
                with open("firmware/page.mpfs", 'bw+') as f:
                        for byte in BYTES:
                                if type(byte)==int:
                                        f.write(bytes([byte]))
                                else:
                                        f.write(byte)
                print(" "*1 + "[ BUILD SUCCESS ]")
        except:
                print(" "*1 + "[ BUILD FAILURE ]")
                sys.exit(1)
        sys.exit(0)
