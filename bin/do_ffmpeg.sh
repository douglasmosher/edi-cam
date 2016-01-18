#!/bin/sh

/home/root/bin/ffmpeg/ffmpeg -s 640x400 -f video4linux2 -i /dev/video0 -s 640x400 -f video4linux2 -i /dev/video1 \
-filter_complex "nullsrc=size=2560x800 [base];
        [0:v] setpts=PTS-STARTPTS, scale=1280x800 [left];
        [1:v] setpts=PTS-STARTPTS, scale=1280x800 [right];
        [base][left] overlay=shortest=1 [tmp1]; 
        [tmp1][right] overlay=shortest=1:x=1280
" 
-f mpeg1video -b 100k -r 30 http://127.0.0.1:8082

