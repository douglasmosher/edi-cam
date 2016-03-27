/******************************************************************************
* pong.cpp
* Play a game of pong on the Edison OLED Block!
* Jim Lindblom @ SparkFun Electronics
* Original Creation Date: January 8, 2014
*
* This sketch uses the Edison OLED library to draw a 3-D projected
* cube, and rotate it along all three axes.
*
* This code is beerware; if you see me (or any other SparkFun employee) at the
* local, and you've found our code helpful, please buy us a round!
*
* Distributed as-is; no warranty is given.
******************************************************************************/

#include <iostream>
#include "oled/Edison_OLED.h"
#include "gpio/gpio.h"
#include "math.h"
#include <unistd.h> // for usleep
#include <stdlib.h> // Gives us atoi
#include <stdio.h>
#include <Adafruit_DotStar.h>
#include <SPI.h> 

using namespace std;

// LED Variables:
int NUMPIXELS = 3;

// Pin definitions:
// All buttons have pull-up resistors on-board, so just declare
// them as regular INPUT's
gpio CLOCKPIN(44, OUTPUT;
gpio DATAPIN(45, OUTPUT);
Adafruit_DotStar strip = Adafruit_DotStar(
  NUMPIXELS, DATAPIN, CLOCKPIN, DOTSTAR_BRG);

int main(void)
{
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000L)
  clock_prescale_set(clock_div_1); // Enable 16 MHz on Trinket
#endif

  strip.begin(); // Initialize pins for output
  strip.setPixelColor(0, 0xFFFFFF);
  strip.setBrightness(255);
  strip.show();
}
