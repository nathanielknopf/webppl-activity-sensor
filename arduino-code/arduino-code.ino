const int noise_sensor = A0;
const int motion_sensor_a = 8;
const int motion_sensor_b = 9;

const int sampleWindow = 50; // Sample window width in mS (50 mS = 20Hz)
const int multiplier = 600;
const int sample_delay = 50;
const int num_saved = 40;

int state_a;
int state_b;
unsigned int sample;
double noise_states[num_saved];
bool motion_states[num_saved];
int inByte = 0;

void setup() {
   Serial.begin(9600);
   pinMode(motion_sensor_a, INPUT);
   pinMode(motion_sensor_b, INPUT);
}

void updateArrays(double newNoise, bool newMotion){
  for(int i = 1; i < num_saved; i++){
    noise_states[i-1] = noise_states[i];
    motion_states[i-1] = motion_states[i];
  }
  noise_states[num_saved-1] = newNoise;
  motion_states[num_saved-1] = newMotion;
}

void loop() {
  unsigned long startMillis = millis();  // Start of sample window
  unsigned int peakToPeak = 0;   // peak-to-peak level
 
  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;
 
  while (millis() - startMillis < sampleWindow) {
    sample = analogRead(noise_sensor);
    if (sample < 1024) {
      if (sample > signalMax) {
        signalMax = sample;  // save max levels
      }else if (sample < signalMin) {
        signalMin = sample;  // save min levels
      }
    }
  }
  
  peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
  double noise = ((peakToPeak * 3.3 * multiplier) / 1024);  // convert to volts

  if (noise > 10.0){
     noise = 10.0; // max value for noise
  }

  state_a = digitalRead(motion_sensor_a);
  state_b = digitalRead(motion_sensor_b);

  if ((state_a == 1) || (state_b == 1)){
    updateArrays(noise, true); 
  }else{
    updateArrays(noise, false);
  }

  //Print out the state arrays if queue received
  if (Serial.available() > 0){
    inByte = Serial.read();
//    Serial.println("Noise data:");
    for(int i = 0; i < num_saved; i++){
      Serial.println(noise_states[i]);
    }
//    Serial.println("Motion data:");
    for(int i = 0; i < num_saved; i++){
      if (motion_states[i]){
        Serial.println("true");
      }else{
        Serial.println("false");
      }
    }
  }

  //wait a bit
  delay(sample_delay);
}
