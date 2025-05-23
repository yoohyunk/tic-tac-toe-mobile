// screens/signIn.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const signInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "At least six characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle1}>Tic{"      "}</Text>
        <Text style={styles.headerTitle2}>Tac</Text>
        <Text style={styles.headerTitle3}>{"      "}Toe</Text>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInSchema}
        onSubmit={async (values) => {
          try {
            const user = await login(values.email, values.password);
          } catch (error) {
            alert("An error occurred during login");
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.body}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Sign in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/signUp")}
              >
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Welcome back to Tic-Tac-Toe!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#40395b",
    gap: 20,
  },
  header: {
    backgroundColor: "#40395b",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },
  headerTitle1: {
    fontSize: 80,
    fontWeight: "900",
    color: "#53b2df",
    textAlign: "left",
  },
  headerTitle2: {
    fontSize: 80,
    fontWeight: "900",
    color: "#f0857d",
    textAlign: "center",
  },
  headerTitle3: {
    fontSize: 80,
    fontWeight: "900",
    color: "#fff",
    textAlign: "right",
  },
  input: {
    width: 320,
    height: 50,
    padding: 12,
    borderWidth: 2,
    borderColor: "#4c436c",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginVertical: 5,
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginVertical: 4,
    textAlign: "center",
  },
  buttons: {
    flex: 1,
    gap: 20,
  },
  button: {
    backgroundColor: "#fcd45c",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: 320,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
  },
  footer: {
    height: 70,
    padding: 10,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
