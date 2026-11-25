import { hashSync } from 'bcryptjs'

const userData = {
  users: [
    {
      name: 'Admin',
      email: 'shadmehress@gmail.com',
      password: hashSync('13821382', 10),
      role: 'admin',
    },
    {
      name: 'User',
      email: 'user@velora.ir',
      password: hashSync('12345', 10),
      role: 'user',
    },
  ],
}

export default userData
