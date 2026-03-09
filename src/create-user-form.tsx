import { useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validations = {
    minLength: password.length >= 16,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    noWhitespace: !/\s/.test(password),
    noUsername:
      username.length === 0 ||
      !password.toLowerCase().includes(username.toLowerCase()),
    noPasswordWord: !password.toLowerCase().includes("password"),
    noRepeat: !/(.)\1{2,}/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!allValid) {
    alert("Password does not meet requirements.");
    return;
  }

  const usernamePassword = `${username}:${password}`;
  const encoded = btoa(usernamePassword);

  try {
    const response = await fetch(
      "https://api.challenge.hennge.com/api/challenges/frontend-validation/2024",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          github_url: "https://gist.github.com/shOumik-saha/48cce71f8fb0af2aaa70d85ff6349509",
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      alert("Mission completed!");
      setUserWasCreated(true);
    } else {
      alert("Submission failed");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
}

  function ruleStyle(valid: boolean): CSSProperties {
    return {
      color: valid ? "green" : "red",
      fontSize: "14px",
    };
  }

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        {/* Username */}

        <label style={formLabel} htmlFor="username">
          Username
        </label>

        <input
          id="username"
          name="username"
          style={formInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password */}

        <label style={formLabel} htmlFor="password">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          style={formInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Password Rules */}

        <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
          <li style={ruleStyle(validations.minLength)}>
            Password must be at least 16 characters
          </li>

          <li style={ruleStyle(validations.lowercase)}>
            Must contain a lowercase letter
          </li>

          <li style={ruleStyle(validations.uppercase)}>
            Must contain an uppercase letter
          </li>

          <li style={ruleStyle(validations.number)}>
            Must contain a number
          </li>

          <li style={ruleStyle(validations.symbol)}>
            Must contain a symbol
          </li>

          <li style={ruleStyle(validations.noWhitespace)}>
            Cannot contain whitespace
          </li>

          <li style={ruleStyle(validations.noUsername)}>
            Cannot contain the username
          </li>

          <li style={ruleStyle(validations.noPasswordWord)}>
            Cannot contain the word "password"
          </li>

          <li style={ruleStyle(validations.noRepeat)}>
            Cannot contain repeated characters
          </li>
        </ul>

        {/* Submit */}

        <button
          style={{
            ...formButton,
            opacity: allValid ? 1 : 0.5,
            cursor: allValid ? "pointer" : "not-allowed",
          }}
          disabled={!allValid}
        >
          Create User
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: "500px",
  width: "80%",
  backgroundColor: "#efeef5",
  padding: "24px",
  borderRadius: "8px",
};

const form: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: "none",
  padding: "8px 16px",
  height: "40px",
  fontSize: "14px",
  backgroundColor: "#f8f7fa",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
};

const formButton: CSSProperties = {
  outline: "none",
  borderRadius: "4px",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  backgroundColor: "#7135d2",
  color: "white",
  fontSize: "16px",
  fontWeight: 500,
  height: "40px",
  padding: "0 8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "8px",
  alignSelf: "flex-end",
  cursor: "pointer",
};