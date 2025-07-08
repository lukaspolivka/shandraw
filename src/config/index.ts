const config = {
  app_name: 'Shandraw',
  developer: 'Mohammad Farhad',
  token_name: (process.env.TOKEN_NAME || process.env.NEXT_PUBLIC_TOKEN_NAME) as string,
  base_url: (process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL) as string,
  bcrypt_salt: Number(process.env.BCRYPT_SALT),
  jwt: {
    secret: new TextEncoder().encode(process.env.SECRET),
    expires: process.env.EXPIRES as string,
    reset_secret: new TextEncoder().encode(process.env.RESET_SECRET),
    reset_expires: process.env.RESET_EXPIRES as string,
  },
  nodemailer: {
    host: process.env.MAIL_HOST as string,
    port: Number(process.env.MAIL_PORT),
    username: process.env.MAIL_USERNAME as string,
    password: process.env.MAIL_PASSWORD as string,
    from: process.env.MAIL_FROM as string,
  },
};

export default config;
