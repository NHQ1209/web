// Authentication - SignIn SignUp
import { useEffect, useState } from "react";
import styled from "styled-components";
import { registerAPI } from "~/apis";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

function Register() {
  // State để lưu trữ tên đăng nhập và mật khẩu
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userInfo');
  }, []);

  // Hàm xử lý sự kiện đăng nhập
  const handleRegister = () => {
    if (!name || name.trim() === '') {
        toast.error('Họ và Tên không được để trống!');
        return;
    }

    if (!username || username.trim() === '') {
        toast.error('Tên đăng nhập không được để trống!');
        return;
    }

    if (password !== rePassword) {
        toast.error('Mật khẩu phải giống nhau!');
        return;
    }

    if (password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    let data = {
        name: name,
        username: username,
        password: password
    }

    // Gọi API xử lý phía BE
    setLoading(true);
    registerAPI(data).then((res) => {
        if (res && res.messageCode != 200) {
            setLoading(false);
            toast.error(res.message);
            return;
        }

        toast.success(res.message);
        setTimeout(() => {
            navigate('/');
        }, 1000);
    });
  };

  return (
    <>
      <FormContainer>
        <h2>Đăng ký</h2>
        <Input
          type="text"
          placeholder="Họ và Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
        <Button disabled={loading} type="button" onClick={handleRegister}>
          Lưu
        </Button>
      </FormContainer>
    </>
  );
}

export default Register;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 150px;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;

  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

// Style cho form container
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
