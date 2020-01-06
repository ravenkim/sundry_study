#!/usr/bin/env bash
if [ -z "$BASH_VERSION" ]
then
    exec bash "$0" "$@"
fi

FLAG="0";
while [ "$FLAG" -eq "0" ]; do
 read -p "SELECT WIFI MODE: 1) STATION or 2)ACCESS POINT: " WIFIMODE;
  if [ "$WIFIMODE" -eq "1" ] || [ "$WIFIMODE" -eq "2" ]; then
   FLAG="1";
  fi;
done

unset WIFISSID
while [ -z ${WIFISSID} ]; do
 read -p "ENTER WIFI SSID (limit 32chars): " WIFISSID;
done

unset WIFIPASS
while [ -z ${WIFIPASS} ]; do
 read -p "ENTER WIFI PASS (8-64chars): " WIFIPASS;
done

python3 scripts/apstation_patch.py $WIFISSID $WIFIPASS $WIFIMODE

if [ $? -eq 1 ]
then
   echo "PATCH FAILED, ABORTING."
   exit
fi

if [ `uname` = "Linux" ]; then
    echo -e "\n----- [ BURNING FIRMWARE / LINUX DETECTED / ENUMERATING DEVICES ]"
    ls /dev/ttyUSB* > /dev/null 2>&1
    if [ $? -eq 2 ]
    then
      echo "ERROR: No programmer detected. Is it plugged in? You may need to install the CP2102 driver: https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers"
      exit
    fi

    if [ $? -eq 0 ]; then
      devices=($(ls /dev/ttyUSB*))
    if [ $? -eq 2 ]
    then
      echo "ERROR: No programmer detected. Is it plugged in? You may need to install the CP2102 driver: https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers"
      exit
    fi

      for DEVICE in "${devices[@]}"; do
        echo -e "\n> PROBING $DEVICE\n"
        if [ "$?" -eq "0" ]; then
          python ./scripts/esptool.py -b 460800 --port $DEVICE write_flash --erase-all -fs 1MB -fm dout 0xfc000 firmware/esp_init_data_default_v08.bin 0x00000 firmware/image.elf-0x00000.bin 0x10000 firmware/image.elf-0x10000.bin 524288 firmware/page.mpfs
        fi
      done
    fi
elif [ `uname` = "Darwin" ]; then
    echo -e "\n----- [ BURNING FIRMWARE / DARWIN DETECTED / ENUMERATING DEVICES ]"
    ls /dev/cu.*serial* > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      devices=($(ls /dev/cu.*serial*))
      for DEVICE in "${devices[@]}"; do
        echo -e "\n> PROBING $DEVICE\n"
        if [ "$?" -eq "0" ]; then
          python ./scripts/esptool.py -b 460800 --port $DEVICE write_flash --erase-all -fs 1MB -fm dout 0xfc000 firmware/esp_init_data_default_v08.bin 0x00000 firmware/image.elf-0x00000.bin 0x10000 firmware/image.elf-0x10000.bin 524288 firmware/page.mpfs
        fi
      done
    fi
    ls /dev/cu.*SLAB*UART* > /dev/null 2>&1
    if [ $? -eq 1 ]
    then
      echo "ERROR: No programmer detected. Is it plugged in? You may need to install the CP2102 driver: https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers"
      exit
    fi
    if [ $? -eq 0 ]; then
      devices=($(ls /dev/cu.*SLAB*UART*))
      for DEVICE in "${devices[@]}"; do
        echo -e "\n> PROBING $DEVICE\n"
        if [ "$?" -eq "0" ]; then
          python ./scripts/esptool.py -b 460800 --port $DEVICE write_flash --erase-all -fs 1MB -fm dout 0xfc000 firmware/esp_init_data_default_v08.bin 0x00000 firmware/image.elf-0x00000.bin 0x10000 firmware/image.elf-0x10000.bin 524288 firmware/page.mpfs
        fi
      done
    fi
else
    echo -e "\n----- [ NOT DARWIN OR LINUX ]\n"
fi
