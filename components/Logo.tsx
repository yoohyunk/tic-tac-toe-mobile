import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const Logo = () => {
  // 각각의 뷰에 대한 Animated.Value 초기화 (초기 스케일은 1)
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;

  // 바운스 애니메이션 효과를 생성하는 함수
  const bounceAnimation = (anim: Animated.Value) => {
    return Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.2, // 확대할 스케일 값
        duration: 100, // 애니메이션 지속 시간 (밀리초)
        useNativeDriver: true, // 성능 최적화를 위해 네이티브 드라이버 사용
      }),
      Animated.spring(anim, {
        toValue: 1, // 원래 크기로 복귀
        friction: 3, // 마찰 값 (낮을수록 많은 튕김)
        tension: 40, // 당기는 힘 (높을수록 더 강한 효과)
        useNativeDriver: true,
      }),
    ]);
  };

  useEffect(() => {
    // 세 개의 애니메이션을 순차적으로 실행: 첫 번째 → 두 번째 → 세 번째
    Animated.stagger(120, [
      bounceAnimation(scaleAnim1),
      bounceAnimation(scaleAnim2),
      bounceAnimation(scaleAnim3),
    ]).start();
  }, [scaleAnim1, scaleAnim2, scaleAnim3]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim1 }] }, styles.box]}
      >
        <Text style={styles.headerTitle1}>Tic{"      "}</Text>
      </Animated.View>
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim2 }] }, styles.box]}
      >
        <Text style={styles.headerTitle2}>Tac</Text>
      </Animated.View>
      <Animated.View
        style={[{ transform: [{ scale: scaleAnim3 }] }, styles.box]}
      >
        <Text style={styles.headerTitle3}>{"      "}Toe</Text>
      </Animated.View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#40395b",
    justifyContent: "center",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 1,
  },

  box: {
    marginVertical: -20,
  },

  headerTitle1: {
    fontSize: 100,
    fontWeight: "900",
    color: "#53b2df",
    textAlign: "left",
    textShadowColor: "#301f42",
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 4,
  },
  headerTitle2: {
    fontSize: 100,
    fontWeight: "900",
    color: "#f0857d",
    textAlign: "center",
    textShadowColor: "#301f42",
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 4,
  },
  headerTitle3: {
    fontSize: 100,
    fontWeight: "900",
    color: "#fff",
    textAlign: "right",
    textShadowColor: "#301f42",
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 4,
  },
});
