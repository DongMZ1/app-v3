type TTarget = "new" | "replace";
interface IOpenURL {
  url: string;
  target?: TTarget;
}

const openURL = ({ url, target = "replace" }: IOpenURL) => {
  let _window = null;
  if (target === "replace") _window = window.location.replace(url);
  if (target === "new") _window = window.open(url);
  if (_window != null) {
    _window.focus();
  }
};

export default openURL;
