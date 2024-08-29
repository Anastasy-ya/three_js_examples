// функция, адаптирующая сцену под размер экрана
export const handleResize = (sceneParamsRef) => {
  const { camera, renderer } = sceneParamsRef.current || {};

  if (camera && renderer) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // задержка срабатывания для предотвращения слишком частых срабатываний
    (function throttle() {
      setTimeout(() => {

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

      }, 500);
    }())

  } else {
    console.log('No sceneParams');
  }
};