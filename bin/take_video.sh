#Take photo with ffmpeg
/home/root/bin/ffmpeg/ffmpeg -t 5 -s 1280x720 -f video4linux2 -input_format mjpeg -i /dev/video0 -s 1280x720 -f video4linux2 -input_format mjpeg -i /dev/video1 -filter_complex "nullsrc=size=2560x720 [base]; [0:v] setpts=PTS-STARTPTS, scale=1280x720 [left]; [1:v] setpts=PTS-STARTPTS, scale=1280x720 [right]; [base][left] overlay=shortest=1 [tmp1]; [tmp1][right] overlay=shortest=1:x=1280" -c:v libx264 -preset ultrafast -f mp4 /home/root/edi-cam/bin/videos/1.mp4