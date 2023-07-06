class UserDto {
  constructor(model) {
    this.email = model.email;
    this.userName = model.password;
    this.id = model.id;
    this.isActivate = model.isActivate;
  }
}

module.exports = UserDto;
