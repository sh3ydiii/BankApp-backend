module.exports = class UserDto {
    _id;
    number;
    card;

    constructor(model) {
        this.id = model._id;
        this.number = model.number;
        this.card = model.card;
    }
}