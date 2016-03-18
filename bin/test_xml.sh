#Ammend the xml file with a path to the newly added photo
#sed '29 s/<!-- add photo here -->/\
sed 's/<!-- add photo here -->/\
<!-- add photo here -->\
line 1\
line 2\
line 3\
line 4\
line 5/' <test.xml >test.xml.new