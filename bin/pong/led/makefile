CC=g++
CFLAGS=-c -Wall
LDFLAGS=
SOURCES=spi/spi_port_edison.cpp spi/spi_device_edison.cpp led.cpp oled/Edison_OLED.cpp gpio/gpio_edison.cpp dotstar/Adafruit_DotStar.cpp
OBJECTS=$(SOURCES:.cpp=.o)
EXECUTABLE=led

all: $(SOURCES) $(EXECUTABLE)
	
$(EXECUTABLE): $(OBJECTS) 
	$(CC) $(LDFLAGS) $(OBJECTS) -o $@

.cpp.o:
	$(CC) $(CFLAGS) $< -o $@

clean:
	rm -rf *.o $(EXECUTABLE)