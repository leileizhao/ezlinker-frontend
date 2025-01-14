import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { Drawer, Modal } from 'antd';
import { DrawerProps } from 'antd/lib/drawer';
import { IUsePopupBox } from '../type';

export interface IPopupBoxOptions {
  type: 'Drawer' | 'Modal';
}

/**
 * 自动提交表单的弹出框
 * @param ModalContentFC 弹出框的内容组件
 * @param action 提交地址
 * @param opt 弹出框的配置
 */
const usePopupBox = (
  Content: React.FC<any>,
  drawerPropsDefault: DrawerProps = {},
  type: 'Modal' | 'Drawer',
): IUsePopupBox => {
  let hasRender = false;
  const [visible, setVisible] = useState<boolean>(false);
  const [contentProps, setContentProps] = useState<any>({});
  const [drawerProps, setDrawerProps] = useState<DrawerProps>(drawerPropsDefault);

  const CustomPopupBox = type === 'Modal' ? Modal : Drawer;

  const show = (contentPropsArg?: any, drawerPropsArg?: DrawerProps) => {
    setVisible(true);
    if (contentPropsArg) setContentProps({ ...contentProps, ...contentPropsArg });
    if (drawerPropsArg) setDrawerProps({ ...drawerProps, ...drawerPropsArg });
  };

  const cancle = () => setVisible(false);

  const register = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    ReactDOM.render(
      <CustomPopupBox {...drawerProps} onClose={cancle} visible={visible}>
        <Content {...contentProps}></Content>
      </CustomPopupBox>,
      div,
    );
    return div;
  };

  const destroy = (div: HTMLElement) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };

  const render = () => {
    hasRender = true;
    return (
      <CustomPopupBox {...drawerProps} onClose={cancle} visible={visible}>
        <Content {...contentProps}></Content>
      </CustomPopupBox>
    );
  };

  useEffect(() => {
    if (hasRender) return () => {};
    const container = register();
    return () => {
      destroy(container);
    };
  }, [visible]);

  return {
    cancle,
    show,
    render,
  };
};

export default usePopupBox;
