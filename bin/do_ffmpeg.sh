#!/bin/sh

/home/root/bin/ffmpeg/ffmpeg -s 640x400 -f video4linux2 -i /dev/video0 -s 640x400 -f video4linux2 -i /dev/video1 -filter_complex "nullsrc=size=1280x400 [base]; [0:v] setpts=PTS-STARTPTS, scale=640x400 [left]; [1:v] setpts=PTS-STARTPTS, scale=640x400 [right]; [base][left] overlay=shortest=1 [tmp1]; [tmp1][right] overlay=shortest=1:x=640" -f mpeg1video \
-b:v 100k -r 25 http://127.0.0.1:8082
#/home/root/bin/ffmpeg/ffmpeg -s 640x360 -f video4linux2 -i /dev/video0 -s 640x360 -f video4linux2 -i /dev/video1 -filter_complex "nullsrc=size=1280x360 [base]; [0:v] setpts=PTS-STARTPTS, scale=640x360 [left]; [1:v] setpts=PTS-STARTPTS, scale=640x360 [right]; [base][left] overlay=shortest=1 [tmp1]; [tmp1][right] overlay=shortest=1:x=640" -c:v mpeg1video -b 100k -r 30 http://127.0.0.1:8082
