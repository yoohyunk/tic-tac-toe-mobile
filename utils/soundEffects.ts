import { Audio } from "expo-av";

async function playClickingSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("../sounds/console-clicking-sound.mp3")
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound", error);
  }
}

async function playLaserSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("../sounds/laser.mp3")
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound", error);
  }
}

async function playLogoSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/logo-pn9.wav")
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound", error);
  }
}

async function playTechSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/tech_gui_9.wav")
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound", error);
  }
}

export { playClickingSound, playLaserSound, playLogoSound, playTechSound };
