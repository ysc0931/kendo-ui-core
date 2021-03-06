---
title: Filtering
page_title: Filtering | Telerik UI DropDownTree HtmlHelper for ASP.NET Core
description: "Learn about the filtering functionality of the Telerik UI DropDownTree HtmlHelper for ASP.NET Core (MVC 6 or ASP.NET Core MVC)."
slug: htmlhelpers_dropdowntree_filtering_aspnetcore
position: 3
---

# Filtering

The built-in filtering functionality enables the user to filter the displayed DropDownTree items by their text value.

By default, filtering is disabled and can be performed over string values using the field set as `DataTextField`.

The DropDownTree supports the following filter values:

* `StartsWith`
* `EndsWith`
* `Contains`

The following example demonstrates how to set the filter of the DropDownTree.

```
    @(Html.Kendo().DropDownTree()
        .Name("dropdowntree")
        .DataTextField("Name")
        .Filter(FilterType.Contains)
        .DataSource(dataSource => dataSource
            .Read(read => read
                .Action("Read_DropDownTreeData", "Home")
            )
        )
    )
```

## See Also

* [Ajax Data Binding by the DropDownTree HtmlHelper for ASP.NET Core (Demo)](https://demos.telerik.com/aspnet-core/dropdowntree/remote-data-binding)
* [Server-Side API](/api/dropdowntree)
