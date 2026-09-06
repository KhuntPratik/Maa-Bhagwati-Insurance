function SectionHeader({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`section-header ${align === "left" ? "text-left" : "text-center"}`}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export default SectionHeader;
