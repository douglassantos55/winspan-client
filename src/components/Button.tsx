import styles from './Button.module.css';
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    text?: string
} & ButtonHTMLAttributes<HTMLButtonElement>>

function Button(props: Props) {
    return (
        <button {...props} className={styles.btn}>
            {props.text || props.children}
        </button>
    );
}

export default Button;
