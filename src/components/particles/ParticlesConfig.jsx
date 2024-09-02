const particlesConfig = {
  background: {
    color: {
      value: "#453719",
    },
    image: "",
    position: "",
    repeat: "",
    size: "",
    opacity: 1,
  },
  fullScreen: {
    enable: false,
    zIndex: -1,
  },
  particles: {
    number: {
      value: 100,
    },
    color: {
      value: "#ffdc91",
    },
    links: {
      enable: true,
      distance: 200,
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 1,
    },
    size: {
      value: {
        min: 4,
        max: 6,
      },
    },
    move: {
      enable: true,
      speed: 2,
    },
  },
  poisson: {
    enable: true,
  },
};
export default particlesConfig;
