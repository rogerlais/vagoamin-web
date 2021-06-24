#! /bin/bash


#todo parametrizar para ser invocado pelo Node.js


Broadcast=255.255.255.255

#Roger
Broadcast=100.21.73.81
MAC=43:46:9A:00:2A:72


PortNumber=9
echo -e $(echo $(printf 'f%.0s' {1..12}; printf "$(echo $MAC | sed 's/://g')%.0s" {1..16}) | sed -e 's/../\\x&/g') | nc -w1 -u -b $Broadcast $PortNumber
PortNumber=7
echo -e $(echo $(printf 'f%.0s' {1..12}; printf "$(echo $MAC | sed 's/://g')%.0s" {1..16}) | sed -e 's/../\\x&/g') | nc -w1 -u -b $Broadcast $PortNumber
