import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDisplay(dateStr) {
  if (!dateStr) return "Pick a date";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DatePicker({ value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleOpen() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverHeight = 340; // approximate calendar height
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        top: rect.top + window.scrollY - popoverHeight - 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((o) => !o);
  }

  const selected = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        className={cn("w-full justify-start font-normal", className)}
        onClick={toggleOpen}
      >
        {formatDisplay(value)}
      </Button>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ position: "absolute", top: coords.top, left: coords.left }}
            className="z-50 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md"
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (date) {
                  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  onChange(iso);
                }
                setOpen(false);
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}