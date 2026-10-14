import React, { useState } from "react";
import { BOM_DATA, type BomItem } from "../data/bomData";
import { Copy, Check, LayoutGrid, Table, X } from "lucide-react";

export const ShoppingList: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<BomItem | null>(null);

  const filteredItems = filter === "all" 
    ? BOM_DATA 
    : BOM_DATA.filter((i) => i.category === filter);

  const totalCost = BOM_DATA.reduce((acc, curr) => acc + (curr.unitPricePhp * curr.qty), 0);
  const coreCost = BOM_DATA
    .filter(i => i.category !== "enclosure_wiring")
    .reduce((acc, curr) => acc + (curr.unitPricePhp * curr.qty), 0);

  const handleCopyKeyword = (item: BomItem) => {
    navigator.clipboard.writeText(item.searchKeyword);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopyAll = () => {
    const text = BOM_DATA.map((item, idx) => 
      `${idx + 1}. [${item.name}] - ₱${item.unitPricePhp} x ${item.qty} = ₱${item.unitPricePhp * item.qty}\n   Shopee Search: "${item.searchKeyword}"`
    ).join("\n\n");
    navigator.clipboard.writeText(`HULOG BILL OF MATERIALS (BOM)\nTotal Prototype Cost: ₱${totalCost} PHP\n\n${text}`);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
        <div>
          <h2 className="page-title">Bill of Materials (BOM)</h2>
          <p className="lead-text">
            All components are standard off-the-shelf maker items available on Shopee/Lazada PH.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className="eyebrow">04. HARDWARE PROCUREMENT</span>
          {/* View mode toggle */}
          <div style={{ display: "flex", border: "1px solid var(--border-light)" }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === "table" ? "btn-black" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
              style={{ border: "none", borderRadius: 0 }}
            >
              <Table size={13} />
              <span style={{ fontSize: "0.68rem" }}>TABLE</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === "grid" ? "btn-black" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Photo Grid View"
              style={{ border: "none", borderRadius: 0 }}
            >
              <LayoutGrid size={13} />
              <span style={{ fontSize: "0.68rem" }}>PHOTOS</span>
            </button>
          </div>

          <button 
            type="button" 
            className="btn btn-black"
            onClick={handleCopyAll}
          >
            {allCopied ? <Check size={14} /> : <Copy size={14} />}
            <span>{allCopied ? "COPIED ALL!" : "COPY ALL SHOPEE SEARCHES"}</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cost Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="clean-card">
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>CORE ELECTRONICS</span>
          <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>₱{coreCost}.00</div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            ESP32, OLED, keypad, relay, 12V solenoid, IR sensor, and 12V adapter.
          </p>
        </div>

        <div className="clean-card" style={{ border: "1px solid var(--border)" }}>
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>TOTAL PROTOTYPE BOM</span>
          <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>₱{totalCost}.00</div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Includes tabletop demonstration box, hinges, and jumper wires.
          </p>
        </div>

        <div className="clean-card">
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>SOURCING LEAD TIME</span>
          <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>2–4 DAYS</div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Standard local Metro Manila shipping via Shopee Express / J&T.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {[
          { id: "all", label: `ALL (${BOM_DATA.length})` },
          { id: "brain", label: "BRAIN & SENSING (6)" },
          { id: "power_lock", label: "LOCK & POWER (5)" },
          { id: "enclosure_wiring", label: "BOX & WIRES (3)" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`btn btn-sm ${filter === t.id ? "btn-black" : ""}`}
            onClick={() => setFilter(t.id)}
            style={{ fontSize: "0.7rem", padding: "0.3rem 0.65rem" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* VIEW MODE 1: Table View with Photo Thumbnails */}
      {viewMode === "table" ? (
        <div style={{ overflowX: "auto", border: "1px solid var(--border-light)" }}>
          <table className="bom-table">
            <thead>
              <tr>
                <th style={{ width: "64px", textAlign: "center" }}>Item</th>
                <th>Part Name</th>
                <th>Spec & Role</th>
                <th>Voltage</th>
                <th>Price</th>
                <th>Shopee Keyword</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isCopied = copiedId === item.id;
                return (
                  <tr key={item.id}>
                    {/* Item Image Thumbnail */}
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div 
                        onClick={() => setPreviewItem(item)}
                        title="Click to enlarge"
                        style={{ 
                          width: "48px", 
                          height: "48px", 
                          borderRadius: "4px", 
                          border: "1px solid var(--border-light)", 
                          overflow: "hidden", 
                          background: "#ffffff",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.15s ease",
                        }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2px" }} 
                          loading="lazy"
                        />
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{item.name}</div>
                      <span className="tag" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem", marginTop: "0.2rem" }}>
                        {item.priority}
                      </span>
                    </td>

                    <td style={{ maxWidth: "280px" }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>{item.spec}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        {item.role}
                      </div>
                    </td>

                    <td>
                      <span className="font-mono" style={{ fontSize: "0.75rem", background: "var(--surface)", padding: "0.15rem 0.4rem", border: "1px solid var(--border-light)" }}>
                        {item.voltage}
                      </span>
                    </td>

                    <td>
                      <div className="font-mono" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        ₱{item.unitPricePhp}
                      </div>
                      <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        qty: {item.qty}
                      </div>
                    </td>

                    <td style={{ maxWidth: "240px" }}>
                      <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-secondary)", background: "var(--surface)", padding: "0.3rem 0.5rem", border: "1px solid var(--border-light)", wordBreak: "break-word" }}>
                        "{item.searchKeyword}"
                      </div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${isCopied ? "btn-black" : ""}`}
                        onClick={() => handleCopyKeyword(item)}
                        style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? "COPIED" : "COPY"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW MODE 2: Visual Photo Grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.25rem" }}>
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div 
                key={item.id} 
                className="clean-card"
                style={{ display: "flex", flexDirection: "column", padding: "1rem", position: "relative" }}
              >
                {/* Photo Header */}
                <div 
                  onClick={() => setPreviewItem(item)}
                  style={{ 
                    height: "170px", 
                    width: "100%", 
                    background: "#ffffff", 
                    border: "1px solid var(--border-light)", 
                    borderRadius: "4px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    marginBottom: "0.75rem"
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }}
                    loading="lazy"
                  />
                </div>

                {/* Priority Badge & Price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span className="tag" style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem" }}>
                    {item.priority}
                  </span>
                  <div className="font-mono" style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                    ₱{item.unitPricePhp}
                  </div>
                </div>

                {/* Name & Spec */}
                <div style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.3, marginBottom: "0.3rem" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "0.75rem", flex: 1 }}>
                  {item.spec}
                </div>

                {/* Shopee Copy Button */}
                <button
                  type="button"
                  className={`btn btn-sm ${isCopied ? "btn-black" : ""}`}
                  onClick={() => handleCopyKeyword(item)}
                  style={{ width: "100%", fontSize: "0.7rem", padding: "0.4rem 0.5rem", justifyContent: "center" }}
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{isCopied ? "SEARCH COPIED!" : "COPY SHOPEE SEARCH"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal with Pop Animation */}
      {previewItem && (
        <div 
          onClick={() => setPreviewItem(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1.5rem",
            animation: "pageFadeSlideIn 0.2s ease"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border)",
              maxWidth: "520px",
              width: "100%",
              padding: "2rem",
              position: "relative",
              animation: "modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)"
            }}
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ 
              width: "100%", 
              height: "280px", 
              background: "#ffffff", 
              border: "1px solid var(--border-light)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              marginBottom: "1.25rem",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <img 
                src={previewItem.image} 
                alt={previewItem.name} 
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <span className="eyebrow" style={{ fontSize: "0.68rem" }}>{previewItem.category.toUpperCase()}</span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{previewItem.name}</h3>
              </div>
              <div className="font-mono" style={{ fontSize: "1.3rem", fontWeight: 900 }}>
                ₱{previewItem.unitPricePhp}
              </div>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
              {previewItem.spec}
            </p>

            <div style={{ background: "var(--surface)", padding: "0.75rem", border: "1px solid var(--border-light)", marginBottom: "1.25rem" }}>
              <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>SHOPEE SEARCH KEYWORD</span>
              <div className="font-mono" style={{ fontSize: "0.82rem", fontWeight: 700, marginTop: "0.15rem" }}>
                "{previewItem.searchKeyword}"
              </div>
            </div>

            <button
              type="button"
              className="btn btn-black"
              onClick={() => handleCopyKeyword(previewItem)}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Copy size={14} />
              <span>COPY SHOPEE SEARCH TERM</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
