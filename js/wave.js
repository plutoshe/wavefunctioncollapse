class Wave 
{
    constructor() 
    {
        this.m_data = [];
        this.m_relations = [];
        this.m_result = [];
        this.m_size = 0;
    }

    Load() 
    {

    }

    Generating()
    {
        for (var i = 0; i < this.m_size; i++) 
        {
            var currentGeneratingItem = this.Pop();
            if (currentGeneratingItem.Select()) 
            {
                this.m_result.push(currentGeneratingItem);
                wave.Influence(currentGeneratingItem);
            } 
            else 
            {
                return false;
            }
        }
        return true;
    }

    Output() 
    {

    }

    Pop() {
        this.
    }
}

// Wave.Pop = function() {

// }