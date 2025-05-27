export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-md changetext3 ` + className}>
            {value ? value : children}
        </label>
    );
}
