"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/shadcn"
import { coreColors } from "../light-theme-colors"
import { cn } from "../../utils"

export interface TeamHubTabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TeamHubTabsProps {
  items: TeamHubTabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
}

const TeamHubTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  TeamHubTabsProps
>(({ 
  items, 
  defaultValue, 
  value, 
  onValueChange, 
  className,
  variant = "underline",
  size = "md",
  ...props 
}, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || items[0]?.value || "")
  
  const currentValue = value !== undefined ? value : activeTab
  
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue)
    }
    onValueChange?.(newValue)
  }

  // Size variants
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm", 
    lg: "h-12 text-base"
  }

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          list: "bg-gray-100 p-1 rounded-lg",
          trigger: "rounded-md px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        }
      case "underline":
        return {
          list: "bg-transparent border-b border-gray-200 rounded-none p-0 h-auto",
          trigger: `
            relative rounded-none border-b-2 border-transparent px-4 py-3 
            font-medium transition-all hover:text-gray-900
            data-[state=active]:border-purple-500 data-[state=active]:text-purple-600
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 
            after:bg-purple-500 after:transition-all after:duration-300
            data-[state=active]:after:w-full
          `.replace(/\s+/g, ' ').trim()
        }
      default:
        return {
          list: "bg-gray-50 border border-gray-200 rounded-lg p-1",
          trigger: "rounded-md px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <Tabs
      ref={ref}
      value={currentValue}
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
      className={cn("w-full", className)}
      {...props}
    >
      <TabsList
        className={cn(
          "inline-flex items-center justify-start w-full",
          sizeClasses[size],
          variantStyles.list
        )}
        style={{
          backgroundColor: variant === "underline" ? "transparent" : coreColors.background.secondary,
          borderColor: variant === "underline" ? coreColors.border.light : "transparent"
        }}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap font-medium",
              "ring-offset-background transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              variantStyles.trigger
            )}
            style={{
              color: currentValue === item.value 
                ? coreColors.brand.primary 
                : coreColors.text.secondary,
              borderBottomColor: variant === "underline" && currentValue === item.value 
                ? coreColors.brand.primary 
                : "transparent",
              backgroundColor: variant !== "underline" && currentValue === item.value
                ? coreColors.background.primary
                : "transparent"
            }}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={cn(
            "mt-4 ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          style={{
            color: coreColors.text.primary
          }}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
})

TeamHubTabs.displayName = "TeamHubTabs"

export { TeamHubTabs }
