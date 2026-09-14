
interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    children: React.ReactNode;
  }
  
  export function Checkbox({ checked, onChange, children }: CheckboxProps) {
    return (
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 12px',
          border: '1px solid #ccc',
          borderRadius: 16,
          cursor: 'pointer',
          background: checked ? '#e0f0ff' : 'transparent',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ marginRight: 6 }}
        />
        {children}
      </label>
    );
  }