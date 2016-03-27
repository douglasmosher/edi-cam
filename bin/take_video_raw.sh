#Take photo with ffmpeg
/home/root/bin/ffmpeg/ffmpeg -t 10 -s 1280x720 -f video4linux2 -input_format mjpeg -c:v copy /home/root/edi-cam/bin/videos/1.mjpg