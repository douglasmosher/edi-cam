sed -i 's/blah/\
<!-- add photo here -->\
<scene name="'"$file"'" title="'"$file"'" onstart="" lat="'"$lat"'" lng="'"$lon"'" heading="0.0">\
<view hlookat="-1" vlookat="11" fovtype="MFOV" fov="120" maxpixelzoom="2.0" fovmin="70" fovmax="140" limitview="auto"/>\
<image>\
	<sphere url="'photos"$file"'"/>\
</image>/' test.xml
