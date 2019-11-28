export default `body {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
.chatHolder {
  height: 156px;
  overflow: hidden;
  color: #282828;
  font-family: sans-serif;
  font-size: 14px;
  display: flex;
  flex-direction: column-reverse;
}
.data {
  width: 100%;
}
.icon {
  font-size: 35px;
  text-align: center;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
}
.message {
  display: flex;
  padding: 4px;
  margin-top: 2px;
  min-height: 50px;
  transition: all 2s;
  background-color: rgba(0,0,0,0.4);
  border-radius: 4px;
}
.author {
  font-size: 12px;
  font-weight: bold;
}
.message-list-enter, .message-list-leave-to{
  opacity: 0;
  transform: translateX(30px);
}`
