import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";

const signInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "At least six characters").required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerbutton} onPress={() => router.push("/")}>
          <Text style={styles.headerbuttonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={signInSchema}
        onSubmit={(values) => {
          console.log(values);
          router.push("/");
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
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
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={()=>handleSubmit()}>
              <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#b9badf",
    paddingTop: 40,
  },
  header: {
    backgroundColor: "#40395b",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerbutton: {
    alignItems: "center",
    padding: 10,
  },
  headerbuttonText: {
    color:"#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  input: {
    width: 320,
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
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: 130,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color:"#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#f0857d",
    width: "50%",
    height: 70,
    padding: 10,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
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
