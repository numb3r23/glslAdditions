#!/bin/sh

declare -a angles=(90 180 270)
declare -a orientation=("pos" "neg")
declare -a axis=("x" "y" "z")

function rotator 
{
  convert $1.jpg -rotate $2 $1$2.jpg
}

function rotateClock
{
  for angle in "${angles[@]}"
  do
    rotator $1 $angle
  done
}

function rotateFaces
{
  for o in "${orientation[@]}"
  do
    for a in "${axis[@]}"
    do
      rotateClock $o$a
    done
  done
}

function deleteFaces
{
  for o in "${orientation[@]}"
  do
    for a in "${axis[@]}"
    do
      for angle in "${angles[@]}"
      do
        rm $o$a$angle.jpg
      done
    done
  done
}

function createAVG
{
  echo "Creating AVG image"
  convert negx.jpg posx.jpg negy.jpg posy.jpg negz.jpg posz.jpg \
  -evaluate-sequence mean \
  -gaussian-blur 23x36 \
  -resize 1x1 \
  -resize 512x512 \
  avg.jpg
}

function blurFace
{
  echo "Creating face "$3
  convert  avg.jpg $1.jpg  avg.jpg +append tmp1.jpg
  convert   $2.jpg $3.jpg   $4.jpg +append tmp2.jpg
  convert  avg.jpg $5.jpg  avg.jpg +append tmp3.jpg

  convert tmp1.jpg tmp2.jpg tmp3.jpg -append -crop 768x768+384+384 c$3.jpg

  convert c$3.jpg -gaussian-blur 16x16 -crop 512x512+128+128 blur/$3.jpg

  rm c$3.jpg
}

createAVG
rotateFaces

blurFace posy negx posz posx negy
blurFace posy90 posz posx negz negy270
blurFace posy180 posx negz negx negy180
blurFace posy270 negz negx posz negy90

blurFace posz negx270 negy posx90 negz180
blurFace negz180 negx90 posy posx270 posz

deleteFaces
echo "done."
