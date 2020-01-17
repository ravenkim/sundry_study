VERSION: [ 011620 @ 19:41:50 CST ] AKA v1.4.1

# To flash the O.MG Cable: 
- Plug in the programmer to computer
- Plug in the cable to programmer
- Run one of the flashers and follow the menu to build a new firmware with your chosen wifi settings
- - **flash_[linux/OSX/win64.exe]** - a binary for those who want to do the lease amount of work 
- - - for linux & osx, make sure you set the file as executable. ex: `chmod +x flash_osx` before you run it: ex `./flash_osx`
- - **flash.py** - for those who know how to execute python scripts, but want the script to automatically install some dependencies. 
- - **flash_alternative.py** - for only the most 1337 hacker who knows about pip install and wants to do everything themselves
- pay attention to the dialog, you might have to install a driver!
- When finished, unplug the programmer and plug the cable into a USB port.
- Wait a bit for all of the services to start up (usually 60 seconds is plenty)

# Connect to the O.MG Cable:
- **If in Station mode**, the O.MG Cable connects as a client and will be available via http://whatever-IP-your-network-assigns-the-cable or http://OMG_LASTSIXOFMACID.local. (ex: http://OMG_D1361A.local)
- **If in Access Point mode**, you can connect to the SSID you specified and the cable will be accessible via http://192.168.4.1 or http://OMG_LASTSIXOFMACID.local (ex: http://OMG_D1361A.local)

# NOTE: 
- If you have issues with any of the flasher, make sure you are running a current OS and have followed any of the dialog presented by the flasher. 
- The flasher script requires that you have python 3.7 or higher & with the pyserial module installed. To install pyserial use `python3 -m pip install pyserial`
- There are os specific compiled binary flashers for OS X/Linux/Windows. flash_win64.exe, flash_osx, flash_linux. They are static and do not require python3 or pyserial but still require the firmware files. The OS X & Linux bins require an executable flag. e.g. `chmod +x flash_linux && ./flash_linux`.
- If you're looking to use http://OMG_LASTSIXOFMACID.local rather than an ip address, your macid is shown to you while flashing the firwmare.
- If the programmer is not detected, you may need to install the drivers for CP210X USB bridge: https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers




----



SOFTWARE LICENSE AGREEMENT
IMPORTANT - PLEASE READ CAREFULLY: THIS END-USER LICENSE AGREEMENT ("EULA" OR "AGREEMENT") IS A LEGAL AGREEMENT BETWEEN YOU (EITHER AN INDIVIDUAL OR A SINGLE ENTITY) ("YOU" OR "USER") AND MISCHIEF GADGETS LLC, OF 548 MARKET STREET #61961, SAN FRANCISCO, CALIFORNIA, 94104 ("OWNER"). BY USING ANY MISCHIEF GADGETS PRODUCT OR ANY PROPRIETARY SOFTWARE DEVELOPED BY THE OWNER ("SOFTWARE"), THE USER, EITHER ON BEHALF OF YOURSELF AS AN INDIVIDUAL OR ON BEHALF OF AN ENTITY AS ITS AUTHORIZED REPRESENTATIVE, AGREES TO ALL OF THE TERMS OF THIS AGREEMENT. BY INSTALLING, COPYING, OR OTHERWISE USING THE SOFTWARE, YOU AGREE TO BE BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO THE TERMS OF THIS AGREEMENT, DO NOT INSTALL OR USE THE PRODUCTS OR SOFTWARE.

1. GRANT OF LICENSE The SOFTWARE is protected by copyright laws and laws protecting the confidentiality of trade secrets. The SOFTWARE is licensed, not sold. Any supplemental software or software code, provided to the USER as part of support, shall be considered part of the SOFTWARE and subject to the terms and conditions of this AGREEMENT. Subject to the terms of this AGREEMENT, OWNER hereby grants USER a non-transferable license to use the SOFTWARE for authorized network auditing and security analysis purposes only where permitted subject local and international laws where applicable. USER is solely responsible for compliance with all laws of their locality.

2. LICENSE RESTRICTIONS The USER may not: (a) Reverse engineer, decompile, or disassemble any portions of the SOFTWARE, or allow others to do so, except and only to the extent that such activity is expressly permitted by applicable law, notwithstanding this limitation; (b) Distribute the SOFTWARE or any derivative works based upon the SOFTWARE, in whole or in part, to any third-party or entity without prior written authorization from the OWNER; (c) Resell, lease, rent, transfer, sub-license, or otherwise transfer rights to the SOFTWARE to any third-party or entity without prior written authorization from the OWNER; (d) Copy, clone, duplicate, or distribute copies of the SOFTWARE from one computer to another, or electronically transfer the SOFTWARE from one computer to another over any public or private network, without prior written authorization from the OWNER; (e) Use the SOFTWARE for any unlawful or unethical purpose or deploy the SOFTWARE to any computer system which the USER has no legal right to access; (f) Attempt in any way to obliterate or destroy the trade secret or copyright notice that is incorporated into and part of the SOFTWARE. The USER must reproduce fully the trade secret or copyright notice in all copies of the SOFTWARE. (g) USE THE SOFTWARE IN ANY APPLICATION WHERE THE SOFTWARE MAY RESULT IN DEATH, PERSONAL INJURY OR SEVERE PHYSICAL OR ENVIRONMENTAL DAMAGE.

3. TITLE, OWNERSHIP, INTELLECTUAL PROPERTY YOU acknowledge that no title to the SOFTWARE or the intellectual property contained within it is transferred to YOU, the USER. The OWNER retains exclusive ownership of all rights, title and interest in and to the SOFTWARE, source code, and intellectual property. It is understood and agreed that the SOFTWARE, including any accompanying scripts and support files, is copyrighted by the OWNER and may not be reproduced and/or redistributed without the advanced written consent of the OWNER except where expressly permitted under this AGREEMENT. The SOFTWARE is protected by copyright laws, and the USER must treat the SOFTWARE like any other copyrighted material except the USER may install the SOFTWARE as provided by this AGREEMENT. Any rights not expressly granted are reserved by the OWNER.

4. MAINTENANCE The OWNER shall not be obligated to provide maintenance and/or updates and/or fixes for the SOFTWARE; however, any such maintenance and/or updates and/or fixes provided by the OWNER shall be covered by this AGREEMENT.

5. EXPORT CONTROL As required by U.S. law, the USER represents and warrants that it: (a) Is not located in a prohibited destination country under U.S. sanctions regulations; (b) Will not export, re-export, or transfer the SOFTWARE to any prohibited destination, entity, or individual without the necessary export license(s) or authorization(s) from the U.S. Government; (c) Will not use or transfer the SOFTWARE for use in any sensitive nuclear, chemical or biological weapons, or missile technology end-uses unless authorized by the U.S. Government by regulation or specific license; (d) Understands and agrees that if it is in the United States and exports or transfers the SOFTWARE to eligible end users, it will comply with U.S. export regulations and laws; and (e) Understands that countries other than the United States may restrict the import, use, or export of encryption products and that it shall be solely responsible for compliance with any such import, use, or export restrictions.

6. TERMINATION The USER may terminate this AGREEMENT at any time by uninstalling the SOFTWARE and destroying all copies of the SOFTWARE in possession of the USER. This AGREEMENT shall terminate automatically if the USER fails to comply with the terms of this AGREEMENT. Upon termination, the USER must uninstall and destroy all copies of the SOFTWARE and all of its components. TERMINATION OF THIS AGREEMENT SHALL NOT RELIEVE THE USER OF ITS OBLIGATIONS REGARDING THE PROTECTION OF COPYRIGHTS AND TRADE SECRETS RELATING TO THE PRODUCT.

7. DISCLAIMER OF WARRANTY THE OWNER EXPRESSLY DISCLAIMS ANY WARRANTY FOR THE SOFTWARE. THE SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE OWNER DISCLAIMS ALL WARRANTIES, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. THE OWNER DOES NOT WARRANT OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR COMPLETENESS OF ANY INFORMATION, TEXT, GRAPHICS, LINKS, OR OTHER ITEMS CONTAINED WITHIN THE SOFTWARE. THE OWNER MAKES NO WARRANTIES RESPECTING ANY HARM THAT MAY BE CAUSED BY THE TRANSMISSION OF A COMPUTER VIRUS, WORM, OR OTHER SUCH COMPUTER PROGRAM. THE OWNER FURTHER EXPRESSLY DISCLAIMS ANY WARRANTY OR REPRESENTATION TO USER OR TO ANY THIRD PARTY.

8. LIMITATION OF LIABILITY THE ENTIRE RISK ARISING OUT OF THE USE AND/OR PERFORMANCE OF THE PRODUCT AND/OR DOCUMENTATION REMAINS WITH THE USER TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AND IN NO EVENT SHALL THE OWNER BE LIABLE FOR ANY CONSEQUENTIAL, INCIDENTAL, DIRECT, INDIRECT, SPECULATIVE, PUNITIVE, OR OTHER DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR OTHER PECUNIARY LOSS) ARISING OUT OF THIS AGREEMENT OR THE USE OF OR INABILITY TO USE THE PRODUCT, EVEN IF THE OWNER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE OWNER SHALL HAVE NO LIABILITY WITH RESPECT OF THE CONTENT OF THE SOFTWARE OR ANY PART THEREOF, INCLUDING BUT NOT LIMITED TO ERRORS OR OMISSIONS CONTAINED THEREIN, LIBEL, INFRINGEMENTS OF RIGHTS OF PUBLICITY, PRIVACY, TRADEMARK RIGHTS, BUSINESS INTERRUPTION, PERSONAL INJURY, LOSS OF PRIVACY, MORAL RIGHTS OR THE DISCLOSURE OF CONFIDENTIAL INFORMATION. ANY LIABILITY OF THE OWNER SHALL BE EXCLUSIVELY LIMITED TO THE PRODUCT REPLACEMENT OR RETURN OF THE PURCHASE/LICENSING PRICE. NO OTHER ADVERTISING, DESCRIPTION OR REPRESENTATION, WHETHER OR NOT MADE BY THE OWNER OR THE OWNER'S DEALER, DISTRIBUTOR, AGENT OR EMPLOYEE, SHALL BE BINDING UPON THE OWNER OR SHALL CHANGE THE TERMS OF THIS WARRANTY.

9. USER REMEDIES The OWNER'S entire liability and YOUR exclusive remedy shall be, at the OWNER's option, either (a) return of the price paid, or (b) replacement of the SOFTWARE.

10. GOVERNING LAW This AGREEMENT shall be governed by and construed in accordance with the laws of the State of California.

11. ENTIRE AGREEMENT This AGREEMENT constitutes the entire understanding between the OWNER and the USER. The USER agrees that this is the entire agreement between the USER and the OWNER, and supersedes any prior agreement, whether written or oral, and all other communications between the OWNER and the USER relating to the subject matter of this AGREEMENT and cannot be altered or modified, except in writing.

12. RESERVATION OF RIGHTS All rights not expressly granted under this AGREEMENT are reserved entirely to the OWNER.

13. HEADINGS AND CAPTIONS The captions of this AGREEMENT are for convenience and reference only, and in no way define or limit the intent, rights, or obligations of the parties hereunder. Additionally, any heading preceding the text of any of the paragraphs in this AGREEMENT are inserted solely for convenience of reference and shall not constitute a part of the AGREEMENT, nor shall they affect the meaning, construction or effect of any of the paragraphs of the AGREEMENT.

14. BINDING EFFECT This AGREEMENT and the terms and conditions of this AGREEMENT shall be binding upon the parties to this AGREEMENT and their respective heirs, personal representatives and assigns.

15. INTERPRETATION No provision of this AGREEMENT shall be interpreted for or against any party to this AGREEMENT by reason of the fact that the party or his/ her counsel or legal representative drafted all or any part of this AGREEMENT.

16. ATTORNEY'S FEES In any action under this AGREEMENT, the prevailing party shall be entitled to reasonable attorney's fees set by the Court or by arbitration.

17. SEVERABILITY Should any provision of this AGREEMENT be found, held or deemed to be unenforceable, voidable, or void as contrary to law or public policy under the state of California or other appropriate jurisdiction, the parties intend and agree that the remaining provisions shall nevertheless continue in full force and be binding upon the parties, their heirs, personal representatives, and assigns.



STATEMENT OF CONDITIONS

O.MG Cable is a trademark of Mischief Gadgets LLC. This product is packaged with a limited warranty, the acceptance of which is a condition of sale. See o.mg.lol for additional warranty details and limitations. Availability and performance of certain features, services and applications are device and network dependent and may not be available in all areas; additional terms, conditions and/or charges may apply. All features, functionality and other product specifications are subject to change without notice or obligation. Mischief Gadgets LLC does not assume any liability that may occur due to the use or application of the product(s) described herein. Made in China. Designed by MG in California. Distributed by Hak5 LLC, 548 Market Street #39371, San Francisco, CA 94104. Hak5.org

The O.MG Cable is a pentesting tool for authorized auditing and security Analysis purposes only where permitted subject to local and international laws where applicable. Users are solely responsible for compliance with all laws of their locality. Mischief Gadgets LLC, Hak5 LLC, and affiliates claim no responsibility for unauthorized or unlawful use. 


FCC NOTICE: This kit is designed to allow: 

(1) Product development to evaluate electronic components, circuitry, or software associated with the kit to determine whether to incorporate such items in a finished product and

(2) Software developers to write software applications for use with the end product. This kit is not a finished product and when assembled may not be resold or otherwise market  unless all required FCC equipment authorizations are first obtained. Operation is subject to the condition that this product not cause harmful interference to licensed radio stations and that this product accept harmful interference. Unless the assembled kit is designed to operate under part 15, part 18 or part 95 of this chapter, the operator of the kit must operate under the authority of an FCC license holder or must secure an experimental authorization under part 5 of this chapter. For evaluation only; not FCC approved for resale. 
