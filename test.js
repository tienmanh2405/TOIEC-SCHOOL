const handleLogin = async () => {
    try {
      let endpoint = isAdmin ? "http://localhost:5000/quanly/login" : "http://localhost:5000/user/login";
  
      const response = await axios.post(endpoint, {
        Email: email,
        MatKhau: password,
      });

      if (response.success === true) {
        if (isAdmin) {
            const { role } = response;
            switch (role) {
                case "Admin":
                  navigate("/admin-dashboard");
                  break;
                case "GiangVien":
                  navigate("/GiangVien-dashboard");
                  break;
                default:
                  setError(true);
                  break;
            }
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true); 
    }
  };
  