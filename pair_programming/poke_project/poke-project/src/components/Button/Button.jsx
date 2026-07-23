export default function Button({children, ...props}){
    const style={
        padding:"10px 16px",
        backgroundColor: "royalblue",
        color:"white",
        border:"none",
        borderRadius:"6px",
        cursor:"pointer"
    }
    return (
        <button style={ style } {...props}>{children}</button>
    )
}