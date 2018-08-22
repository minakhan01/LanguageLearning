## Setup Firebase for Raspberry Pi Zero W

**If your Raspberry Pi Zero did not come with node installed, first install node and node package manager**

#### Download the necessary packages 

In your node folder, use npm to install the following packages:

`npm install node-wifi @google-cloud/storage python-shell`

These are additional packages that allow you to use Network Manager to have greater control over Wifi management. 

1. Install the needed packages with the following command: 

   `sudo apt install network-manager network-manager-gnome openvpn \`
   `openvpn-systemd-resolved network-manager-openvpn \`
   `network-manager-openvpn-gnome`

2. Remove unneeded packages:

   `sudo apt purge openresolv dhcpcd5`

3. Replace /etc/resolv.conf with a symlink to /lib/systemd/resolv.conf :

   `sudo ln -sf /lib/systemd/resolv.conf /etc/resolv.conf`