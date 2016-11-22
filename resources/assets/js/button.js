/**
 * Created by lucas on 11/6/2016.
 */

function Button(id, value, callback, hide) {
    this.id = id;
    this.value = value;
    this.hide = hide === undefined ? true : hide;
    this.callback = callback;
}
module.exports = Button;
