#Ammend the xml file with a path to the newly added photo
echo we here
env

sed 's/<!-- add photo here -->/\
<!-- add photo here -->\
-----------------------------------------------------------------------\
-----------------------------------------------------------------------\
Latitude is '"$lat"'\
longitude is '"$lon"'\
-----------------------------------------------------------------------\
-----------------------------------------------------------------------/' <../../bin/test.xml >../../bin/test.xml.new

#sed 's/<!-- add photo here -->/\
#<!-- add photo here -->\
#<scene name="my_house" title="My House" onstart="" lat="49.2611738" lng="-123.2138352" heading="0.0">\
#<view hlookat="-1" vlookat="11" fovtype="MFOV" fov="120" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto"/>\
#<image>\
#	<sphere url="my_house.jpg"/>\
#</image>/' tour.xml

