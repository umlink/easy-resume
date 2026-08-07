import '@umijs/max/typings';
import { AriaAttributes, StyleHTMLAttributes } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes, StyleHTMLAttributes<T> {
    placeholder?: string;
  }
}
