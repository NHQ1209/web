// Authentication - SignIn SignUp
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loginAPI } from '~/apis';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

function Login() {
  // State để lưu trữ tên đăng nhập và mật khẩu
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/home')
    }
  }, []);

  // Hàm xử lý sự kiện đăng nhập
  const handleLogin = () => {
    if (!username || username.trim() === '') {
      toast.error('Tên đăng nhập không được để trống!');
      return;
    }

    if (!password || password.trim() === '') {
      toast.error('Mật khẩu không được để trống!');
      return;
    }

    let data = {
      username: username,
      password: password,
    };

    // Gọi API xử lý phía BE
    loginAPI(data).then((res) => {
      console.log("res: ", res);
      if (res && res.messageCode != 200) {
        toast.error(res.message);
        return;
      }

      localStorage.setItem('userInfo', JSON.stringify(res.user));
      navigate('/home')
    });
  };

  const handleSignUp = () => {
    navigate('/register')
  }

  return (
    <>
    
      <FormContainer >

        
        <h2>Trello</h2>
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

        <BtnContainer>
          <Button type="button" onClick={handleLogin}>
            Đăng nhập
          </Button>
          <SignUpButton type="button" onClick={handleSignUp}>
            Đăng ký
          </SignUpButton>
        </BtnContainer>
        
      </FormContainer>


    </>
  );
}

export default Login;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
`

const SignUpButton = styled.button`
  width: 150px;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #28a745; // Màu xanh lá cây
  color: #fff;
  cursor: pointer;
`;

const Input = styled.input`
  width: 310px;
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

  &:hover {
    background-color: #0056b3;
  }
`;

// Style cho form container
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  border: 2px solid blue;
  border-radius: 25px;
`;
