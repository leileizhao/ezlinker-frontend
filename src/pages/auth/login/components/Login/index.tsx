import { Form } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import classNames from 'classnames';
import LoginContext, { LoginContextProps } from './LoginContext';
import LoginItem, { LoginItemProps, LoginItemType } from './LoginItem';

import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';
import styles from './index.less';
import { LoginType as LoginParamsType } from '@/services/login';

export interface LoginProps {
  defaultActiveKey?: string;
  onTabChange?: (key: string) => void;
  style?: React.CSSProperties;
  onSubmit?: (error: unknown, values: LoginParamsType) => void;
  className?: string;
  form: FormComponentProps['form'];
  onCreate?: (form?: FormComponentProps['form']) => void;
  children: React.ReactElement<any>[];
}

interface LoginState {
  tabs?: string[];
  type?: string;
  active?: { [key: string]: unknown[] };
}

class Login extends Component<LoginProps, LoginState> {
  public static Tab = LoginTab;

  public static Submit = LoginSubmit;

  public static UserName: React.FunctionComponent<LoginItemProps>;

  public static Password: React.FunctionComponent<LoginItemProps>;

  public static Mobile: React.FunctionComponent<LoginItemProps>;

  public static Captcha: React.FunctionComponent<LoginItemProps>;

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  componentDidMount() {
    const { form, onCreate } = this.props;
    if (onCreate) {
      onCreate(form);
    }
  }

  onSwitch = (type: string) => {
    this.setState(
      {
        type,
      },
      () => {
        const { onTabChange } = this.props;
        if (onTabChange) {
          onTabChange(type);
        }
      },
    );
  };

  getContext: () => LoginContextProps = () => {
    const { form } = this.props;
    const { tabs = [] } = this.state;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: { ...form },
      updateActive: activeItem => {
        const { type = '', active = {} } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];
    if (form) {
      form.validateFields(activeFields as string[], { force: true }, (err, values) => {
        if (onSubmit) {
          onSubmit(err, values);
        }
      });
    }
  };

  render() {
    const { className, children } = this.props;
    const { tabs = [] } = this.state;
    const TabChildren: React.ReactComponentElement<any>[] = [];
    const otherChildren: React.ReactElement<unknown>[] = [];
    React.Children.forEach(
      children,
      (child: React.ReactComponentElement<any> | React.ReactElement<unknown>) => {
        if (!child) {
          return;
        }
        if (child.type.typeName === 'LoginTab') {
          TabChildren.push(child as React.ReactComponentElement<any>);
        } else {
          otherChildren.push(child);
        }
      },
    );
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            {tabs.length ? <React.Fragment>{otherChildren}</React.Fragment> : children}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

(Object.keys(LoginItem) as (keyof LoginItemType)[]).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create<LoginProps>()(Login);
