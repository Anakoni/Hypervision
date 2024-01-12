
#include <TinyGPS.h>


TinyGPS gps;

void setup()
{
  Serial.begin(38400);
}

void loop()
{
  bool newData = false;
  unsigned long chars;
  unsigned short sentences, failed;

  for (unsigned long start = millis(); millis() - start < 1000;)
  {
    while (Serial.available())
    {
      char c = Serial.read();
      Serial.write(c); 
      if (gps.encode(c)) 
        newData = true;
    }
  }

  if (false)
  {
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon);
    Serial.print("\{\"Lat\" : ");
    Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6);
    Serial.print(", \"Long\" : ");
    Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6);
	 Serial.print(", \"Prec\" : ");
    Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());
	 Serial.print("\}");
    Serial.println("");
  }
  
}
